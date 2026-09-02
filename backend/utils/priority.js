const calculatePriority = ({ type, weightage, difficulty, deadline, status }) => {
  if (status === 'Completed') {
    return 0;
  }

  const urgencyMap = {
    Exam: 3,
    Assignment: 2,
    Lab: 1.5,
    Quiz: 1
  };

  const urgency = urgencyMap[type] || 1;
  const deadlineDate = new Date(deadline);
  const now = new Date();

  let msRemaining = deadlineDate.getTime() - now.getTime();
  let daysRemaining = msRemaining / (1000 * 60 * 60 * 24);
  if (daysRemaining <= 0) {
    daysRemaining = 0.5;
  }

  const priority = (urgency * Number(weightage || 1) * Number(difficulty || 1)) / daysRemaining;
  return Number(priority.toFixed(2));
};

module.exports = calculatePriority;
