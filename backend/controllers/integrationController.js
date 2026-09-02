const crypto = require('crypto');
const ConnectTicket = require('../models/ConnectTicket');
const Integration = require('../models/Integration');
const Task = require('../models/Task');
const calculatePriority = require('../utils/priority');
const { getOAuthClient, getAuthUrl } = require('../utils/googleOAuth');
const { getGoogleCalendarClient } = require('../services/googleSyncService');
const {
  fetchNotionDatabases,
  syncNotionTasks
} = require('../services/notionSyncService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const isInCurrentYear = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
};

const shouldImportGoogleCalendarEvent = (event) => {
  if (!event || !event.summary) return false;

  const summary = event.summary || '';
  const organizer = event.organizer?.email || '';
  const recurrence = Array.isArray(event.recurrence) ? event.recurrence.join(' ') : '';
  const text = `${summary} ${recurrence} ${organizer}`.toLowerCase();
  const startValue = event.start?.dateTime || event.start?.date;

  const birthdayPatterns = [
    /\bbirthday\b/,
    /\bhappy birthday\b/,
    /\banniversary\b/,
    /\bcelebration\b/,
    /\byearly\b/,
    /\bannual\b/
  ];

  if (event.eventType === 'birthday') return false;
  if (birthdayPatterns.some((pattern) => pattern.test(text))) return false;
  if (organizer.includes('calendar.google.com') && /birthday|anniversary/.test(text)) return false;
  if (!startValue) return false;
  if (event.recurringEventId) return false;
  if (recurrence.includes('freq=yearly') || recurrence.includes('freq=annual')) return false;
  if (!isInCurrentYear(startValue)) return false;

  return true;
};

/**
 * POST /api/integrations/:platform/ticket
 * Generates an ephemeral ticket (10 min expiry) for OAuth connection flow.
 */
const createConnectTicket = async (req, res, next) => {
  try {
    const platform = req.params.platform?.toLowerCase();
    if (!['google', 'notion'].includes(platform)) {
      return res.status(400).json({ message: 'Invalid platform. Supported platforms: google, notion' });
    }

    const ticket = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Clean up any existing ticket for this user and platform
    await ConnectTicket.deleteMany({ userId: req.user.id, platform });

    await ConnectTicket.create({
      ticket,
      userId: req.user.id,
      platform,
      expiresAt
    });

    return res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/integrations/google/connect?ticket=...
 * Redirects user to Google OAuth consent page.
 */
const connectGoogle = async (req, res, next) => {
  try {
    const { ticket } = req.query;
    if (!ticket) {
      return res.status(400).json({ message: 'Connect ticket is required' });
    }

    const ticketDoc = await ConnectTicket.findOne({ ticket, platform: 'google' });
    if (!ticketDoc || ticketDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired connect ticket' });
    }

    const authUrl = getAuthUrl(ticket);
    return res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/integrations/google/callback?code=...&state=...
 * Google OAuth redirect callback.
 */
const callbackGoogle = async (req, res, next) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error('Google OAuth callback error:', error);
      return res.redirect(`${FRONTEND_URL}?status=error&message=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return res.redirect(`${FRONTEND_URL}?status=error&message=Missing+code+or+state`);
    }

    const ticketDoc = await ConnectTicket.findOne({ ticket: state, platform: 'google' });
    if (!ticketDoc || ticketDoc.expiresAt < new Date()) {
      return res.redirect(`${FRONTEND_URL}?status=error&message=Invalid+or+expired+ticket`);
    }

    const oAuth2Client = getOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);

    let integration = await Integration.findOne({ userId: ticketDoc.userId, platform: 'google' });
    if (!integration) {
      integration = new Integration({ userId: ticketDoc.userId, platform: 'google' });
    }

    integration.connected = true;
    integration.accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      integration.refreshToken = tokens.refresh_token;
    }
    await integration.save();

    await ConnectTicket.deleteOne({ _id: ticketDoc._id });

    return res.redirect(`${FRONTEND_URL}?integration=google&status=success`);
  } catch (error) {
    console.error('Callback Google Error:', error);
    return res.redirect(`${FRONTEND_URL}?status=error&message=${encodeURIComponent(error.message)}`);
  }
};

/**
 * GET /api/integrations/google/sync
 * Fetches events from Google Calendar and imports them as AcadSync tasks.
 * Filters out birthday events, all-day recurring fluff, and events > 2 years out.
 */
const syncGoogle = async (req, res, next) => {
  try {
    const integration = await Integration.findOne({ userId: req.user.id, platform: 'google', connected: true });
    if (!integration) {
      return res.status(400).json({ message: 'Google Calendar integration is not connected' });
    }

    const calendar = await getGoogleCalendarClient(req.user.id);
    if (!calendar) {
      return res.status(400).json({ message: 'Failed to initialize Google Calendar client' });
    }

    const now = new Date();
    // Only pull events within the next 2 years — stops birthday spam through 2090
    const twoYearsOut = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate()).toISOString();

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: twoYearsOut,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100
    });

    const academicEvents = (response.data.items || []).filter(shouldImportGoogleCalendarEvent);

    let syncedCount = 0;

    for (const event of academicEvents) {
      const deadline = new Date(event.start.dateTime || event.start.date);
      let task = await Task.findOne({ userId: req.user.id, integrationEventId: event.id });

      const priority = calculatePriority({
        type: 'Assignment',
        weightage: 10,
        difficulty: 3,
        deadline
      });

      if (task) {
        task.subject = event.summary;
        task.deadline = deadline;
        task.priority = priority;
        await task.save();
      } else {
        task = new Task({
          userId: req.user.id,
          subject: event.summary,
          type: 'Assignment',
          deadline,
          weightage: 10,
          difficulty: 3,
          studyHours: 1,
          status: 'Pending',
          priority,
          integrationEventId: event.id
        });
        await task.save();
      }
      syncedCount++;
    }

    return res.status(200).json({
      message: 'Google Calendar synced successfully',
      count: syncedCount,
      totalEvents: response.data.items?.length ?? 0,
      filtered: (response.data.items?.length ?? 0) - syncedCount
    });
  } catch (error) {
    next(error);
  }
};


/**
 * GET /api/integrations/notion/connect?ticket=...
 * Redirects user to Notion OAuth authorization URL.
 */
const connectNotion = async (req, res, next) => {
  try {
    const { ticket } = req.query;
    if (!ticket) {
      return res.status(400).json({ message: 'Connect ticket is required' });
    }

    const ticketDoc = await ConnectTicket.findOne({ ticket, platform: 'notion' });
    if (!ticketDoc || ticketDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired connect ticket' });
    }

    const clientId = process.env.NOTION_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ message: 'NOTION_CLIENT_ID is not configured in environment variables' });
    }

    const redirectUri = process.env.NOTION_REDIRECT_URI || `${BACKEND_URL}/api/integrations/notion/callback`;
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${ticket}`;

    return res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/integrations/notion/callback?code=...&state=...
 * Notion OAuth redirect callback.
 */
const callbackNotion = async (req, res, next) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error('Notion OAuth callback error:', error);
      return res.redirect(`${FRONTEND_URL}?status=error&message=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return res.redirect(`${FRONTEND_URL}?status=error&message=Missing+code+or+state`);
    }

    const ticketDoc = await ConnectTicket.findOne({ ticket: state, platform: 'notion' });
    if (!ticketDoc || ticketDoc.expiresAt < new Date()) {
      return res.redirect(`${FRONTEND_URL}?status=error&message=Invalid+or+expired+ticket`);
    }

    const clientId = process.env.NOTION_CLIENT_ID;
    const clientSecret = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI || `${BACKEND_URL}/api/integrations/notion/callback`;

    if (!clientId || !clientSecret) {
      return res.redirect(`${FRONTEND_URL}?status=error&message=Notion+credentials+not+configured`);
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Notion OAuth token exchange error:', tokenData);
      return res.redirect(`${FRONTEND_URL}?status=error&message=Notion+OAuth+token+exchange+failed`);
    }

    let integration = await Integration.findOne({ userId: ticketDoc.userId, platform: 'notion' });
    if (!integration) {
      integration = new Integration({ userId: ticketDoc.userId, platform: 'notion' });
    }

    integration.connected = true;
    integration.accessToken = tokenData.access_token;
    await integration.save();

    await ConnectTicket.deleteOne({ _id: ticketDoc._id });

    return res.redirect(`${FRONTEND_URL}?integration=notion&status=success`);
  } catch (error) {
    console.error('Callback Notion Error:', error);
    return res.redirect(`${FRONTEND_URL}?status=error&message=${encodeURIComponent(error.message)}`);
  }
};

/**
 * GET /api/integrations/notion/databases
 * Returns list of accessible Notion databases.
 */
const getNotionDatabases = async (req, res, next) => {
  try {
    const integration = await Integration.findOne({ userId: req.user.id, platform: 'notion', connected: true });
    if (!integration) {
      return res.status(400).json({ message: 'Notion integration is not connected' });
    }

    const accessToken = integration.getDecryptedAccessToken();
    const databases = await fetchNotionDatabases(accessToken);

    return res.status(200).json({ databases });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/integrations/notion/sync
 * Syncs tasks from Notion database(s) into AcadSync.
 */
const syncNotion = async (req, res, next) => {
  try {
    const { databaseId } = req.body || {};
    const integration = await Integration.findOne({ userId: req.user.id, platform: 'notion', connected: true });
    if (!integration) {
      return res.status(400).json({ message: 'Notion integration is not connected' });
    }

    const syncedTasks = await syncNotionTasks(req.user.id, databaseId);

    return res.status(200).json({
      message: 'Notion database synced successfully',
      count: syncedTasks.length,
      tasks: syncedTasks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConnectTicket,
  connectGoogle,
  callbackGoogle,
  syncGoogle,
  connectNotion,
  callbackNotion,
  getNotionDatabases,
  syncNotion,
  shouldImportGoogleCalendarEvent
};
