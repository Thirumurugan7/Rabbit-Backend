const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};



exports.checKUser = async (req, res) => {
  console.log("called");
  const {email} = req.body;
  console.log(email,"mail");
  const user = await User.findOne({ email });
if(user){
  return res.status(200).json({ message: 'User already exists' });

}
else{
  return res.status(201).json({ message: 'User not exists' });

}};


exports.signup = async (req, res) => {
  try {
    const { name, dateOfBirth, gender, email, address, favoriteHabits } = req.body;
    console.log(name, dateOfBirth, gender, email, address, favoriteHabits);
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, dateOfBirth, gender, email, address, favoriteHabit:favoriteHabits });
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
      address:newUser.address
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.login = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      
      habits: user.favoriteHabit,
      token: generateToken(user._id),
    });
  } else {
    return res.status(201).json({ message: 'Invalid email or password' });
  }
  
};

exports.getFavoriteHabits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.favoriteHabits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateHabitProgress = async (req, res) => {
  const { habitId, email, name } = req.body;
console.log( habitId, email,name);
  try {
    const user = await User.findOne({ email });
    console.log(user.favoriteHabit);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const result = await User.updateOne(
      { email: email, 'favoriteHabit.name': name },
      { $inc: { 'favoriteHabit.$.streak': 1, 'favoriteHabit.$.currentProgress': 1 } }
    );

    console.log(result);





    res.status(200).json({ message: 'Habit progress updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

