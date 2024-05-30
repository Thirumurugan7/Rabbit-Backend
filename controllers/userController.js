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
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, dateOfBirth, gender, email, address, favoriteHabits });
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
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
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

