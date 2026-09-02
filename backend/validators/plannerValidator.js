const { z } = require('zod');

const generatePlanSchema = z.object({
  hoursAvailable: z.number().positive('Hours available must be positive')
});

module.exports = { generatePlanSchema };
