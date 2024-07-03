const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/alerts', alertRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eth-price-alert', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a simple route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to ETH Price Alert System');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server error');
});

// Start the server on port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
