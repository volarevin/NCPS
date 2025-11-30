const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken); // Protect all profile routes

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.post('/picture', profileController.uploadProfilePicture);
router.post('/addresses', profileController.addAddress);
router.put('/addresses/:id', profileController.updateAddress);
router.delete('/addresses/:id', profileController.deleteAddress);
router.put('/addresses/:id/primary', profileController.setPrimaryAddress);
router.put('/password', profileController.changePassword);

module.exports = router;
