import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

    const resolvedProjectId = projectId || req.body.project;

    if (!title || !resolvedProjectId || !dueDate) {
      return res.status(400).json({ message: 'Title, project, and due date are required' });
    }

    const project = await Project.findById(resolvedProjectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);

      if (!assignee) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }

      const isProjectAdmin = project.admin.toString() === assignee._id.toString();
      const isProjectMember = project.members.some((memberId) => memberId.toString() === assignee._id.toString());

      if (!isProjectAdmin && !isProjectMember) {
        return res.status(400).json({ message: 'Assigned user must be a project member' });
      }
    }
    
    const task = await Task.create({
      title,
      description,
      project: resolvedProjectId,
      assignedTo,
      status,
      priority,
      dueDate,
    });

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email role');

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    const isAdmin = project.admin.toString() === req.user._id.toString();

    // For members (non-admin): only show tasks assigned to them
    // For admins: show all tasks in the project
    const taskFilter = isAdmin 
      ? { project: projectId }
      : { project: projectId, assignedTo: req.user._id };

    const tasks = await Task.find(taskFilter).populate('assignedTo', 'name email role');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    const hasAssignedToField = Object.prototype.hasOwnProperty.call(req.body, 'assignedTo');

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (!isAdmin) {
      if (req.body.status) {
        task.status = req.body.status;
      }
    } else {
      if (req.body.title !== undefined) {
        task.title = req.body.title;
      }

      if (req.body.description !== undefined) {
        task.description = req.body.description;
      }

      if (hasAssignedToField) {
        task.assignedTo = req.body.assignedTo || undefined;
      }

      if (req.body.status) {
        task.status = req.body.status;
      }

      if (req.body.priority) {
        task.priority = req.body.priority;
      }

      if (req.body.dueDate !== undefined) {
        task.dueDate = req.body.dueDate;
      }

      if (req.body.assignedTo) {
        const assignee = await User.findById(req.body.assignedTo);

        if (!assignee) {
          return res.status(404).json({ message: 'Assigned user not found' });
        }

        const isProjectAdmin = project.admin.toString() === assignee._id.toString();
        const isProjectMember = project.members.some((memberId) => memberId.toString() === assignee._id.toString());

        if (!isProjectAdmin && !isProjectMember) {
          return res.status(400).json({ message: 'Assigned user must be a project member' });
        }
      }
    }

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id).populate('assignedTo', 'name email role');
    res.json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};