import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    });

    const projectIds = projects.map((p) => p._id);

    // For members: only show tasks assigned to them
    // For admins: show all tasks in their projects
    const isAdmin = projects.some((p) => p.admin.toString() === req.user._id.toString());
    
    const taskFilter = isAdmin 
      ? { project: { $in: projectIds } }
      : { project: { $in: projectIds }, assignedTo: req.user._id };

    const tasks = await Task.find(taskFilter).populate('assignedTo', 'name email role');

    const totalTasks = tasks.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = tasks.filter(
      (t) => t.status !== 'Done' && new Date(t.dueDate) < today
    ).length;

    const myTasks = tasks.filter((t) => {
      const assigneeId = t.assignedTo?._id ? t.assignedTo._id.toString() : t.assignedTo?.toString?.();
      return assigneeId === req.user._id.toString();
    });

    res.json({
      totalTasks,
      projectsCount: projects.length,
      overdueTasks,
      myTasksCount: myTasks.length,
    });
  } catch (error) {
    next(error);
  }
};