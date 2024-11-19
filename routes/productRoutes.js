const express = require("express");
const productController = require("../controllers/productController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload-csv",
  authenticateToken,
  upload.single("file"),
  productController.uploadCSV
);
router.post(
  "/products/report/campaign",
  authenticateToken,
  productController.reportByCampaign
);
router.post(
  "/products/report/adGroupID",
  authenticateToken,
  productController.reportByAdGroupID
);
router.post(
  "/products/report/fsnID",
  authenticateToken,
  productController.reportByFSNID
);
router.post(
  "/products/report/productName",
  authenticateToken,
  productController.reportByProductName
);

module.exports = router;
