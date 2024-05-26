const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  frequency: { type: Number, required: true },
  duration: { type: Number, required: true },
  reminderTime: { type: String, required: true },
  progress: { type: [Date], default: [] }
});

module.exports = mongoose.model('Habit', HabitSchema);
