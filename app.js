const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use helmet for securing HTTP headers
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
