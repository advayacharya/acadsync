const calculatePriority = require('../utils/priority');

const calculateTaskPriority = (taskData) => {
  return calculatePriority(taskData);
};

module.exports = {
  calculateTaskPriority
};
