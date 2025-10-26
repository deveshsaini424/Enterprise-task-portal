const TaskModel = require("../models/taskModel");
const ProjectModel = require("../models/projectModel");

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, project, assignee, priority, status, deadline } = req.body;

  if (!title || !project) {
    return res.status(400).json({ message: "Title and Project ID are required" });
  }

  try {
    // Check if project exists
    const projectExists = await ProjectModel.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is on the project team
    if (!projectExists.team.some((member) => member.equals(req.user._id))) {
      return res.status(403).json({ message: "User not authorized for this project" });
    }

    const task = await TaskModel.create({
      title,
      description,
      project,
      assignee: assignee || req.user._id, // Default assignee is the creator
      priority,
      status,
      deadline,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    // Check if project exists
    const project = await ProjectModel.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is on the project team
    if (!project.team.some((member) => member.equals(req.user._id))) {
      return res.status(403).json({ message: "User not authorized for this project" });
    }

    // Find all tasks for that project and populate assignee's name and image
    const tasks = await TaskModel.find({ project: req.params.projectId }).populate(
      "assignee",
      "name email image"
    );

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a task (e.g., change status, assignee)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, assignee, priority, status, deadline } = req.body;

  try {
    let task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the project this task belongs to
    const project = await ProjectModel.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Associated project not found" });
    }

    // Check if user is on the project team
    if (!project.team.some((member) => member.equals(req.user._id))) {
      return res.status(403).json({ message: "User not authorized to update this task" });
    }

    // Update fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.assignee = assignee || task.assignee;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.deadline = deadline || task.deadline;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    let task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await ProjectModel.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Associated project not found" });
    }

    // Only allow team members to delete (or admin/creator)
    if (!project.team.some((member) => member.equals(req.user._id))) {
      return res.status(403).json({ message: "User not authorized to delete this task" });
    }

    await task.deleteOne(); // Mongoose 6.x and later
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
};
