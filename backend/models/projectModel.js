const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    // This will be the ID of the user who created the project (the admin/manager)
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "social-logins", // This MUST match the model name in your userModel.js
    },
    // This will be an array of all users assigned to the project
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "social-logins", // This MUST match the model name in your userModel.js
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const ProjectModel = mongoose.model("Project", projectSchema);
module.exports = ProjectModel;
