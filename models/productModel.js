const db = require("../config/database");

const Product = {
  insertMany: (products, callback) => {
    const stmt = db.prepare(`
            INSERT INTO products (
                campaign_name, ad_group_id, fsn_id, product_name,
                ad_spend, views, clicks, direct_revenue,
                indirect_revenue, direct_units, indirect_units
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

    products.forEach((product) => {
      stmt.run([
        product.campaign_name,
        product.ad_group_id,
        product.fsn_id,
        product.product_name,
        product.ad_spend,
        product.views,
        product.clicks,
        product.direct_revenue,
        product.indirect_revenue,
        product.direct_units,
        product.indirect_units,
      ]);
    });

    stmt.finalize(callback);
  },

  filterBy: (query, params, callback) => {
    db.all(query, params, callback);
  },
};

module.exports = Product;
