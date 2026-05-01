import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    });

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({ project: { $in: projectIds } });

    const totalTasks = tasks.length;
    
    const tasksByStatus = {
      todo: tasks.filter((t) => t.status === 'To Do').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = tasks.filter(
      (t) => t.status !== 'Done' && new Date(t.dueDate) < today
    ).length;

    const myTasks = tasks.filter(
      (t) => t.assignedTo && t.assignedTo.toString() === req.user._id.toString()
    );

    res.json({
      totalTasks,
      tasksByStatus,
      overdueTasks,
      myTasksCount: myTasks.length,
    });
  } catch (error) {
    next(error);
  }
};