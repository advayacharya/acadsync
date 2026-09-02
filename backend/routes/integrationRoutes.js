const express = require('express');
const {
  createConnectTicket,
  connectGoogle,
  callbackGoogle,
  syncGoogle,
  connectNotion,
  callbackNotion,
  getNotionDatabases,
  syncNotion
} = require('../controllers/integrationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:platform/ticket', authMiddleware, createConnectTicket);

router.get('/google/connect', connectGoogle);
router.get('/google/callback', callbackGoogle);
router.get('/google/sync', authMiddleware, syncGoogle);

router.get('/notion/connect', connectNotion);
router.get('/notion/callback', callbackNotion);
router.get('/notion/databases', authMiddleware, getNotionDatabases);
router.post('/notion/sync', authMiddleware, syncNotion);

module.exports = router;
