const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
