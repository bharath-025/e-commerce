const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const Product = require('../models/productModel'); // Assuming this is the correct path

// Setup file upload using multer
const uploadDir = path.join(__dirname, '..', 'uploads');
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
}).single('file');

// Upload CSV function
const uploadCSV = (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = path.join(__dirname, '..', 'uploads', file.originalname);
  fs.renameSync(file.path, filePath); // Ensure the file is moved to the correct location

  // Read and parse the CSV file
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data)) // Push each row into results array
    .on('end', () => {
      // Now insert the CSV data into the database
      Product.insertMany(results, (err) => {
        if (err) {
          console.error('Error inserting data into DB:', err);
          return res.status(500).send('Error inserting data into database');
        }
        return res.status(200).send('CSV file uploaded and data inserted into DB successfully');
      });
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      return res.status(500).send('Error processing the CSV file');
    });
};

module.exports = { uploadCSV, upload };
