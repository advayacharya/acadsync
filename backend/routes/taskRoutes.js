const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const validateBody = require('../validators/validateMiddleware');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getTasks);
router.post('/', validateBody(createTaskSchema), createTask);
router.put('/:id', validateBody(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
