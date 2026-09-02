const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

const getEncryptionKey = () => {
  const key = process.env.TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('TOKEN_ENCRYPTION_KEY is not defined in environment variables');
  }
  if (key.length === 64) {
    return Buffer.from(key, 'hex');
  }
  if (Buffer.byteLength(key, 'utf8') === 32) {
    return Buffer.from(key, 'utf8');
  }
  // Fallback hash to 32 bytes if key length is not exactly 32 bytes
  return crypto.createHash('sha256').update(key).digest();
};

const encryptToken = (text) => {
  if (!text) return text;
  // If already encrypted format (contains two colons and hex), avoid double encryption
  if (typeof text === 'string' && text.startsWith('enc:')) {
    return text;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `enc:${iv.toString('hex')}:${authTag}:${encrypted}`;
};

const decryptToken = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  if (typeof encryptedText !== 'string' || !encryptedText.startsWith('enc:')) {
    // Legacy plaintext token
    return encryptedText;
  }

  const parts = encryptedText.split(':');
  if (parts.length !== 4) {
    return encryptedText;
  }

  const [, ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = getEncryptionKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

module.exports = { encryptToken, decryptToken };
