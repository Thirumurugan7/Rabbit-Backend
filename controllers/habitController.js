const Habit = require('../models/Habit');

exports.createChallenge = async (req, res) => {
  console.log("called");
  try {
    const { name, participants, stakeAmount, email } = req.body;
    console.log(name, participants, stakeAmount, email);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 10); // Set end date 10 days later than start date
    console.log(name, participants, startDate, endDate, stakeAmount, winner, email);
    const newChallenge = new Habit({ email: email, challenges: [{ name, participants, startDate, endDate, stakeAmount, winner }] });
    await newChallenge.save();
    res.status(201).json(newChallenge);
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
