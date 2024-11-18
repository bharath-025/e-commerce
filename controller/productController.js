const fs = require('fs');
const path = require('path');

const uploadCSV = (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = path.join(__dirname, '..', 'uploads', file.originalname);
  fs.renameSync(file.filepath, filePath); 

  return res.status(200).send('CSV file uploaded successfully');
};

module.exports = { uploadCSV };
