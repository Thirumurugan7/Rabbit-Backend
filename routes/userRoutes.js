const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/:userId/habits', protect, userController.getFavoriteHabits);
router.post("/check",userController.checKUser)

module.exports = router;
