const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/:userId/habits', protect, userController.getFavoriteHabits);
router.post("/check",userController.checKUser)

router.post("/update", userController.updateHabitProgress)

router.post("/create", userController.createHabit)
router.post("/create-challenge", userController.createChallenge)


module.exports = router;
