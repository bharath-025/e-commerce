const express = require('express');
const { uploadCSV } = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', authenticateToken, upload.single('file'), uploadCSV);  // API for uploading CSV
// router.post('/report/:filter', authenticateToken, getFilteredProducts); // API for getting filtered products

module.exports = router;

