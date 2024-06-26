const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  favoriteHabit: [{ 
    name: { type: String, required: true },
    decidedFrequency: { type: Number, required: true },
    currentProgress: { type: Number, required: true },
    streak: { type: Number, required: true }
  }],
  reconstructedKeypair: { type: Object }, 
  habitId: {type: String}
});

UserSchema.pre('save', async function (next) {
 
  next();
});



module.exports = mongoose.model('User', UserSchema);


