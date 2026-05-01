import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    })
      .populate('admin', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = req.project;

    if (project.members.includes(user._id) || project.admin.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'User already in project' });
    }

    project.members.push(user._id);
    await project.save();
    
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const project = req.project;

    project.members = project.members.filter((m) => m.toString() !== userId);
    await project.save();

    res.json(project);
  } catch (error) {
    next(error);
  }
};