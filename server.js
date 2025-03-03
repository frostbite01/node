const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes (we'll create these later)
const routes = require('./routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection (we'll set this up next)
const db = require('./models');

// Initialize and sync database
const startServer = async () => {
  try {
    // First, create the database if it doesn't exist
    await db.initializeDatabase();
    
    // Then sync all models with the database
    // force: false - This doesn't drop tables if they already exist
    // alter: true - This checks what is the current state of the table in the database
    //               and performs necessary changes to make it match the model
    await db.sequelize.sync({ force: false, alter: true });
    console.log('Database synchronized successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
