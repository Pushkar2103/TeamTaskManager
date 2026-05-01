import Project from '../models/Project.js';

const checkProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId || req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized as project admin' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkProjectMemberOrAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId || req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.includes(req.user._id);
    const isAdmin = project.admin.toString() === req.user._id.toString();

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { checkProjectAdmin, checkProjectMemberOrAdmin };