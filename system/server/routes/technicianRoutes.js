const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Protect all routes
router.use(verifyToken);
router.use(checkRole(['Technician']));

router.get('/jobs', technicianController.getAssignedJobs);
router.get('/profile', technicianController.getProfile);
router.put('/profile', technicianController.updateProfile);
router.put('/availability', technicianController.updateAvailability);
router.get('/notifications', technicianController.getNotifications);

module.exports = router;