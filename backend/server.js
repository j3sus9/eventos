const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://jesusrepisouma_db_user:jRexvSVo2afPFURl@examenfrontend.6tl8muv.mongodb.net/eventual?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/events', eventsRouter);
app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
