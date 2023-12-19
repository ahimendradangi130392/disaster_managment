const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer();
const logger = require('./helper/logger')();
const app = express();


require('dotenv').config()
// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => logger.error('MongoDB connection error:', err));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/event', eventRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listing at http://${process.env.APP_HOST}:${PORT}`)
});


process.on("uncaughtException", (err) => {
  console.log('uncaughtException');
  logger.error(err.message);
});

process.on("unhandledRejection", (reason) => {
  logger.error(reason);
});
