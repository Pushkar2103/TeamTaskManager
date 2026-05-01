import express from 'express';
import {
  createProject,
  getProjects,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkProjectAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.post('/:projectId/add-member', protect, checkProjectAdmin, addMember);
router.delete('/:projectId/remove-member/:userId', protect, checkProjectAdmin, removeMember);

export default router;