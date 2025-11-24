const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Protect all routes
router.use(verifyToken);
router.use(checkRole(['Customer']));

router.get('/stats', customerController.getDashboardStats);
router.get('/appointments', customerController.getAppointments);
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);

module.exports = router;