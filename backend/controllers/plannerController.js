const { generatePlanForUser } = require('../services/plannerService');

const generatePlan = async (req, res, next) => {
  try {
    const { hoursAvailable } = req.body;
    const result = await generatePlanForUser(req.user.id, hoursAvailable);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePlan };
