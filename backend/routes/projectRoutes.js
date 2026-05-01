import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkProjectAdmin, checkProjectMemberOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.get('/:projectId', protect, checkProjectMemberOrAdmin, getProjectById);
router.post('/:projectId/add-member', protect, checkProjectAdmin, addMember);
router.delete('/:projectId/remove-member/:userId', protect, checkProjectAdmin, removeMember);

export default router;