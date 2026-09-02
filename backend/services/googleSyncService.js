const { google } = require('googleapis');
const Integration = require('../models/Integration');
const { getOAuthClient } = require('../utils/googleOAuth');

const getGoogleCalendarClient = async (userId) => {
  const integration = await Integration.findOne({ userId, platform: 'google', connected: true });
  if (!integration) return null;

  const oAuth2Client = getOAuthClient();
  const decryptedAccessToken = integration.getDecryptedAccessToken();
  const decryptedRefreshToken = integration.getDecryptedRefreshToken();

  oAuth2Client.setCredentials({
    access_token: decryptedAccessToken,
    refresh_token: decryptedRefreshToken
  });

  oAuth2Client.on('tokens', async (newTokens) => {
    if (newTokens.access_token) {
      const updateData = { accessToken: newTokens.access_token };
      if (newTokens.refresh_token) {
        updateData.refreshToken = newTokens.refresh_token;
      }
      await Integration.findOneAndUpdate({ userId, platform: 'google' }, updateData);
    }
  });

  return google.calendar({ version: 'v3', auth: oAuth2Client });
};

const upsertTaskToGoogleCalendar = async (userId, task) => {
  try {
    const calendar = await getGoogleCalendarClient(userId);
    if (!calendar) {
      return { success: false, error: 'Google Calendar not connected', eventId: null };
    }

    const isAllDay = Boolean(task.isAllDay || (!task.startTime && !task.endTime));
    const deadlineDate = new Date(task.deadline);
    const dateStr = deadlineDate.toISOString().split('T')[0];

    let eventResource;

    if (isAllDay) {
      // Google Calendar All-Day Event (using start.date and end.date)
      const nextDay = new Date(deadlineDate.getTime() + 86400000);
      const nextDayStr = nextDay.toISOString().split('T')[0];

      eventResource = {
        summary: task.subject,
        description: `AcadSync Task - Type: ${task.type}, Weightage: ${task.weightage}%, Est. Hours: ${task.studyHours}h`,
        start: {
          date: dateStr
        },
        end: {
          date: nextDayStr
        }
      };
    } else {
      // Timed Event in Google Calendar
      const startTimeStr = task.startTime || '09:00';
      const startLocal = new Date(`${dateStr}T${startTimeStr}:00`);

      let endLocal;
      if (task.endTime) {
        endLocal = new Date(`${dateStr}T${task.endTime}:00`);
      } else {
        endLocal = new Date(startLocal.getTime() + (task.studyHours || 1) * 3600 * 1000);
      }

      // If end time is earlier than or equal to start time, it's an overnight event (ends next day)
      if (endLocal <= startLocal) {
        endLocal = new Date(endLocal.getTime() + 86400000);
      }

      eventResource = {
        summary: task.subject,
        description: `AcadSync Task - Type: ${task.type}, Weightage: ${task.weightage}%, Est. Hours: ${task.studyHours}h`,
        start: {
          dateTime: startLocal.toISOString()
        },
        end: {
          dateTime: endLocal.toISOString()
        }
      };
    }

    if (task.integrationEventId) {
      const res = await calendar.events.update({
        calendarId: 'primary',
        eventId: task.integrationEventId,
        resource: eventResource
      });
      return { success: true, error: null, eventId: res.data.id };
    } else {
      const res = await calendar.events.insert({
        calendarId: 'primary',
        resource: eventResource
      });
      return { success: true, error: null, eventId: res.data.id };
    }
  } catch (error) {
    console.error('Google Calendar sync error:', error.message);
    return { success: false, error: error.message, eventId: null };
  }
};

const deleteFromGoogleCalendar = async (userId, integrationEventId) => {
  try {
    if (!integrationEventId) {
      return { success: false, error: 'No event ID to delete' };
    }
    const calendar = await getGoogleCalendarClient(userId);
    if (!calendar) {
      return { success: false, error: 'Google Calendar not connected' };
    }

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: integrationEventId
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Google Calendar delete error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  getGoogleCalendarClient,
  upsertTaskToGoogleCalendar,
  deleteFromGoogleCalendar
};
