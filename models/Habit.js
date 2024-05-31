const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
  email: { type: String, required: true },
  challenges: [{
    name: { type: String, required: true },
    participants: [{ type:String}],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    stakeAmount: { type: Number, required: true },
    winner: { type: String },
  // Added email field
  }]
});

module.exports = mongoose.model('Habit', HabitSchema);
