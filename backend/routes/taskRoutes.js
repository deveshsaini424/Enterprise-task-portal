const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Import your authentication middleware
const { protect } = require("../middleware/authMiddleware");

// All routes in this file will be protected by the 'protect' middleware
router.use(protect);

// POST /api/tasks - Create a new task
router.post("/", createTask);

// GET /api/tasks/project/:projectId - Get all tasks for a specific project
router.get("/project/:projectId", getTasksByProject);

// PUT /api/tasks/:id - Update a task (status, assignee, etc.)
router.put("/:id", updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", deleteTask);

module.exports = router;
