const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Protect all routes
router.use(verifyToken);

// Create Appointment (Customer only)
router.post('/', checkRole(['Customer']), appointmentController.createAppointment);

// Update Status (Admin, Technician, Receptionist)
// Note: Customers might need to cancel, but we'll handle that separately or allow 'Cancelled' status update for them later if needed.
router.put('/:id/status', checkRole(['Admin', 'Technician', 'Receptionist', 'Customer']), appointmentController.updateAppointmentStatus);

module.exports = router;