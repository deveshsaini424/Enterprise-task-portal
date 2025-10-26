const express = require('express');
const router = express.Router();
const { 
    createProject, 
    getProjects, 
    getProjectById, 
    updateProject, 
    deleteProject, 
    addTeamMember, 
    removeTeamMember, 
    getDashboardStats 
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createProject)
    .get(protect, getProjects);

router.get('/stats', protect, getDashboardStats);

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, updateProject)
    .delete(protect, admin, deleteProject); // Admin-only delete

router.put('/:projectId/team/add', protect, addTeamMember);
router.put('/:projectId/team/remove', protect, removeTeamMember);

module.exports = router; // <-- FIX: Use CommonJS export