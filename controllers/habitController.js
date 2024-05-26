const Habit = require('../models/Habit');

exports.createHabit = async (req, res) => {
  try {
    const { name, frequency, duration, reminderTime } = req.body;
    const newHabit = new Habit({ userId: req.user.id, name, frequency, duration, reminderTime });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateHabitProgress = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);
    if (!habit || habit.userId.toString() !== req.user.id) return res.status(404).json({ message: 'Habit not found' });
    habit.progress.push(new Date());
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
