const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, habitController.createHabit);
router.put('/:habitId/progress', protect, habitController.updateHabitProgress);
router.get('/', protect, habitController.getHabits);

module.exports = router;
