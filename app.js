require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadCSV } = require('./controller/productController');
const { createUser, loginUser, getUserById, updateUser, deleteUser } = require('./controller/authController');
const { authenticateToken } = require('./middlewares/authMiddleware');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Setup file upload using multer
const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') {
      return cb(new Error('Only CSV files are allowed.'));
    }
    cb(null, true);
  }
});

// Routes
app.post('/upload-csv', upload.single('file'), uploadCSV);
app.post('/users', createUser);
app.post('/login', loginUser);
app.get('/users/:id', authenticateToken, getUserById);
app.put('/users/:id', authenticateToken, updateUser);
app.delete('/users/:id', authenticateToken, deleteUser);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
