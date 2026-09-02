const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/authController');
const validateBody = require('../validators/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: { message: 'Too many login/registration attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);

module.exports = router;
