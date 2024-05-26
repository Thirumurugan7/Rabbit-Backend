const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config');

const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'THOIRURMRUURNKSNDFSDS',
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

// Database Connection
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
