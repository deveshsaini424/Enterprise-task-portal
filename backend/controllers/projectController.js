const ProjectModel = require('../models/projectModel');
const TaskModel = require('../models/taskModel'); // Verify filename is exactly taskModel.js
const UserModel = require('../models/userModel'); // Verify filename is exactly userModel.js

// Helper function for user details in response
const populateTeam = 'team creator'; // Fields to populate

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    const { name, description, deadline } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
    }

    try {
        const project = await ProjectModel.create({
            name,
            description,
            deadline: deadline || null,
            creator: req.user._id,
            team: [req.user._id] // Creator is automatically on the team
        });

        // Populate details for immediate return
        const fullProject = await project.populate(populateTeam, 'name email image'); // Added image
        
        res.status(201).json(fullProject);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all projects for the authenticated user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        // Find projects where the user's ID is in the team array
        const projects = await ProjectModel.find({ team: req.user._id })
            .populate(populateTeam, 'name email image') // Added image
            .sort({ createdAt: -1 });

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id)
            .populate(populateTeam, 'name email image'); // Added image
            
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Security check: ensure user is a team member
        // Mongoose _id objects need .equals() for comparison
        const isTeamMember = project.team.some(member => member._id.equals(req.user._id));

        if (!isTeamMember && req.user.role !== 'admin') { // Allow admin override
            return res.status(403).json({ message: 'Not authorized to view this project' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project by ID:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update project details (name, description, deadline)
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    const { name, description, deadline } = req.body;
    try {
        let project = await ProjectModel.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only creator or admin can update core project details
        const isCreator = project.creator.equals(req.user._id);
        const isAdmin = req.user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: 'Only the project creator or admin can update project details' });
        }

        project.name = name || project.name;
        project.description = description !== undefined ? description : project.description;
        project.deadline = deadline !== undefined ? deadline : project.deadline;
        
        const updatedProject = await project.save();
        const fullProject = await updatedProject.populate(populateTeam, 'name email image');

        res.status(200).json(fullProject);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a project and all associated tasks
// @route   DELETE /api/projects/:id
// @access  Private (Admin or Creator)
const deleteProject = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // --- Permission Checks ---
        const isCreator = project.creator.equals(req.user._id);
        const isAdmin = req.user.role === 'admin';

        // --- DEBUG LOGS ---
        console.log("[BACKEND] User ID from Token:", req.user._id);
        console.log("[BACKEND] Project Creator ID from DB:", project.creator);
        console.log("[BACKEND] Is Creator Check (.equals):", isCreator);
        // --- END DEBUG LOGS ---

        // --- THE IF STATEMENT ---
        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: 'Only the project creator or admin can delete this project' });
        }

        // --- Cascade Delete: Delete all tasks associated with the project ---
        await TaskModel.deleteMany({ project: req.params.id });
        
        // --- Delete the Project ---
        await project.deleteOne();
        
        res.status(200).json({ message: 'Project and associated tasks deleted successfully' });
    } catch (error) {
        console.error("Error during project deletion:", error); 
        res.status(500).json({ message: 'Server Error during project deletion' });
    }
}; // <-- END OF deleteProject FUNCTION


// @desc    Add a user to a project's team
// @route   PUT /api/projects/:projectId/team/add
// @access  Private (Creator or Admin)
const addTeamMember = async (req, res) => {
    const { userId } = req.body;
    try {
        // Validate user ID exists
        const userToAdd = await UserModel.findById(userId);
        if (!userToAdd) {
             return res.status(404).json({ message: 'User to add not found' });
        }

        const project = await ProjectModel.findById(req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Check if user is authorized to modify team (Creator or Admin)
        const isCreator = project.creator.equals(req.user._id);
        const isAdmin = req.user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to modify the project team' });
        }

        // Mongoose _id objects need .equals() for comparison
        if (project.team.some(memberId => memberId.equals(userId))) {
            return res.status(400).json({ message: 'User is already a member of this project' });
        }

        project.team.push(userId);
        const updatedProject = await project.save();
        const fullProject = await updatedProject.populate(populateTeam, 'name email image'); // Added image

        res.status(200).json(fullProject);
    } catch (error) {
        console.error("Error adding team member:", error);
        res.status(500).json({ message: 'Server Error' });
    }
}; // <-- END OF addTeamMember FUNCTION


// @desc    Remove a user from a project's team
// @route   PUT /api/projects/:projectId/team/remove
// @access  Private (Creator or Admin)
const removeTeamMember = async (req, res) => {
    const { userId } = req.body;
    try {
        const project = await ProjectModel.findById(req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is authorized to modify team (Creator or Admin)
        const isCreator = project.creator.equals(req.user._id);
        const isAdmin = req.user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to modify the project team' });
        }

        // Prevent removing the creator unless an admin does it
        if (project.creator.equals(userId) && !isAdmin) {
            return res.status(403).json({ message: 'Only an admin can remove the project creator' });
        }
        
        // Prevent user from removing themselves
        if (req.user._id.equals(userId)) {
             return res.status(403).json({ message: 'You cannot remove yourself from the team.' });
        }


        project.team = project.team.filter(memberId => !memberId.equals(userId));
        const updatedProject = await project.save();
        const fullProject = await updatedProject.populate(populateTeam, 'name email image'); // Added image

        res.status(200).json(fullProject);
    } catch (error) {
        console.error("Error removing team member:", error);
        res.status(500).json({ message: 'Server Error' });
    }
}; // <-- END OF removeTeamMember FUNCTION


// @desc    Get stats for dashboard overview
// @route   GET /api/projects/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find projects where the user is a team member
        const userProjects = await ProjectModel.find({ team: userId }).select('_id');
        const projectIds = userProjects.map(p => p._id);
        const totalProjects = projectIds.length;
        
        // Find tasks within those projects (can be assigned to anyone on the team)
        const tasks = await TaskModel.find({ project: { $in: projectIds } });

        const tasksDone = tasks.filter(task => task.status === 'Done').length;
        const tasksInProgress = tasks.filter(task => task.status === 'In Progress').length;
        const tasksTodo = tasks.filter(task => task.status === 'To-Do').length;
        const totalTasks = tasks.length; // Might be useful

        // Calculate upcoming deadlines (e.g., tasks due in the next 7 days in user's projects)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const upcomingDeadlines = tasks.filter(task => 
            task.deadline && 
            task.status !== 'Done' && 
            new Date(task.deadline) >= new Date() && // Ensure it's in the future
            new Date(task.deadline) <= sevenDaysFromNow
        ).length;

        res.status(200).json({
            totalProjects,
            totalTasks, // Added total tasks
            tasksDone,
            tasksInProgress,
            tasksTodo,
            upcomingDeadlines,
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Server Error' });
    }
}; // <-- END OF getDashboardStats FUNCTION


// --- FINAL EXPORTS (MUST BE AT THE END) ---
module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    getDashboardStats,
};

