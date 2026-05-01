import express from 'express';
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkProjectAdmin, checkProjectMemberOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, checkProjectAdmin, createTask);
router.get('/project/:projectId', protect, checkProjectMemberOrAdmin, getProjectTasks);
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;