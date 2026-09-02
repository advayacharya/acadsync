const { google } = require('googleapis');

const getOAuthClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth credentials are not configured in environment variables');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

const getAuthUrl = (state) => {
  const oAuth2Client = getOAuthClient();
  const scopes = ['https://www.googleapis.com/auth/calendar'];

  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    state: state
  });
};

module.exports = {
  getOAuthClient,
  getAuthUrl
};
