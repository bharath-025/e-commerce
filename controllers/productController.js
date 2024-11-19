const fs = require('fs');
const path = require('path');
const multer = require('multer');

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
  fs.renameSync(file.path, filePath);  // Ensure the file is moved to the correct location

  return res.status(200).send('CSV file uploaded successfully');
};

module.exports = { uploadCSV, upload };
