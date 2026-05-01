import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    });

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({ project: { $in: projectIds } }).populate('assignedTo', 'name email role');

    const totalTasks = tasks.length;
    
    const tasksByStatus = {
      toDo: tasks.filter((t) => t.status === 'To Do').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = tasks.filter(
      (t) => t.status !== 'Done' && new Date(t.dueDate) < today
    ).length;

    const myTasks = tasks.filter((t) => {
      const assigneeId = t.assignedTo?._id ? t.assignedTo._id.toString() : t.assignedTo?.toString?.();
      return assigneeId === req.user._id.toString();
    });

    const tasksPerUserMap = new Map();
    tasks.forEach((task) => {
      const assignee = task.assignedTo;
      const key = assignee?._id?.toString() || 'unassigned';

      if (!tasksPerUserMap.has(key)) {
        tasksPerUserMap.set(key, {
          userId: assignee?._id || null,
          name: assignee?.name || 'Unassigned',
          email: assignee?.email || '',
          role: assignee?.role || 'Member',
          count: 0,
        });
      }

      tasksPerUserMap.get(key).count += 1;
    });

    const tasksPerUser = Array.from(tasksPerUserMap.values()).sort((a, b) => b.count - a.count);

    res.json({
      totalTasks,
      projectsCount: projects.length,
      tasksByStatus,
      tasksPerUser,
      overdueTasks,
      myTasksCount: myTasks.length,
    });
  } catch (error) {
    next(error);
  }
};