const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    // Link to the project this task belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project", // This MUST match the model name in projectModel.js
    },
    // Link to the user this task is assigned to
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "social-logins", // This MUST match the model name in userModel.js
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["To-Do", "In Progress", "Done"],
      default: "To-Do",
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("Task", taskSchema);
module.exports = TaskModel;
