const express = require('express');
const { generatePlan } = require('../controllers/plannerController');
const authMiddleware = require('../middleware/authMiddleware');
const validateBody = require('../validators/validateMiddleware');
const { generatePlanSchema } = require('../validators/plannerValidator');

const router = express.Router();

router.use(authMiddleware);
router.post('/generate', validateBody(generatePlanSchema), generatePlan);

module.exports = router;
