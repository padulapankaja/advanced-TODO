import express from 'express';
import {
  createTask,
  getTask,
  getTasks,
  searchTasks,
  deleteTask,
  updateTask,
  updateStatus,
  getIncompleteTask,
} from '../../controllers/taskController';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTaskSchema, updateTaskSchema } from '../../validations/validations';

const router = express.Router();

router.post('/', validateRequest(createTaskSchema), createTask);
router.get('/', getTasks);
router.get('/incomplete', getIncompleteTask);
router.get('/search', searchTasks);
router.patch('/status/:id', validateRequest(updateTaskSchema), updateStatus);
router.get('/:id', getTask);
router.delete('/:id', deleteTask);
router.patch('/:id', validateRequest(updateTaskSchema), updateTask);

export default router;
