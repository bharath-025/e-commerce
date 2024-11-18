const express = require('express');
const { uploadCSV, getFilteredProducts } = require('../controllers/productController');
const authenticate = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', authenticate, upload.single('file'), uploadCSV);
router.post('/report/:filter', authenticate, getFilteredProducts);

module.exports = router;
