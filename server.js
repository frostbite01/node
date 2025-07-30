const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import routes
const routes = require('./routes');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create necessary directories
const makeDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
};
makeDirIfNotExists(path.join(__dirname, 'uploads'));
makeDirIfNotExists(path.join(__dirname, 'templates'));
makeDirIfNotExists(path.join(__dirname, 'generated-docs'));

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use('/templates', express.static('uploads/templates'));
app.use('/generated-docs', express.static('generated-docs'));

// Routes
app.use('/api', routes);
app.use('/users', userRoutes);
app.use('/api/images', imageRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection
const db = require('./models');

// Initialize and sync database
const startServer = async () => {
  try {
    await db.initializeDatabase();

    // Drop all tables forcibly
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.drop();
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Semua tabel berhasil dihapus.');

    // Sync ulang database
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
module.exports = app;
