const fs = require("fs");
const path = require("path");
const multer = require("multer");
const csv = require("csv-parser");
const Product = require("../models/productModel");

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
  fs.renameSync(file.path, filePath);

  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
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

const buildQuery = (filters) => {
  let query = "SELECT * FROM products WHERE 1=1";
  const queryParams = [];

  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value) {
      if (typeof value === "string") {
        query += ` AND ${key} LIKE ?`;
        queryParams.push(`%${value}%`);
      } else {
        query += ` AND ${key} = ?`;
        queryParams.push(value);
      }
    }
  });

  const limit = parseInt(filters.limit, 10) || 10;
  const offset = parseInt(filters.offset, 10) || 0;
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  return { query, queryParams };
};


const generateReport = (req, res, filterFields) => {
  const filters = req.query;
  const { query, queryParams } = buildQuery(filters);

  Product.filterBy(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error retrieving product statistics:", err);
      return handleError(res, "Database query error", 500, err);
    }

    if (!result.length) {
      return handleError(res, "No data found for the given filters", 404);
    }

    const mainKey = filterFields[0];

    const aggregatedData = result.reduce((acc, row) => {
      const key = row[mainKey];

      if (!acc[key]) {
        acc[key] = {
          [mainKey]: key,
          AdSpend: 0,
          Views: 0,
          Clicks: 0,
          TotalRevenue: 0,
          TotalOrders: 0,
        };
      }

      const current = acc[key];
      current.AdSpend += parseFloat(row.ad_spend) || 0;
      current.Views += parseInt(row.views, 10) || 0;
      current.Clicks += parseInt(row.clicks, 10) || 0;
      current.TotalRevenue +=
        (parseFloat(row.direct_revenue) || 0) + (parseFloat(row.indirect_revenue) || 0);
      current.TotalOrders +=
        (parseInt(row.direct_units, 10) || 0) + (parseInt(row.indirect_units, 10) || 0);

      return acc;
    }, {});

    const responseData = Object.values(aggregatedData).map((item) => {
      const ctr = item.Views > 0 ? (item.Clicks / item.Views) * 100 : 0;
      const roas = item.AdSpend > 0 ? item.TotalRevenue / item.AdSpend : 0;

      return {
        campaign: item[mainKey],
        AdSpend: item.AdSpend.toFixed(2),
        Views: item.Views,
        Clicks: item.Clicks,
        CTR: ctr.toFixed(2),
        TotalRevenue: item.TotalRevenue.toFixed(2),
        TotalOrders: item.TotalOrders,
        ROAS: roas.toFixed(2),
      };
    });

    res.status(200).json({
      data: responseData,
      status_code: 200,
    });
  });
};


const reportByCampaign = (req, res) => generateReport(req, res, ["campaign_name"]);
const reportByAdGroupID = (req, res) => generateReport(req, res, ["ad_group_id"]);
const reportByFSNID = (req, res) => generateReport(req, res, ["fsn_id"]);
const reportByProductName = (req, res) => generateReport(req, res, ["product_name"]);

module.exports = {
  uploadCSV,
  upload,
  reportByCampaign,
  reportByAdGroupID,
  reportByFSNID,
  reportByProductName,
};
