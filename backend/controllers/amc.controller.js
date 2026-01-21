import { db } from "../config/db.js";

/* CREATE AMC */
export const createAmc = (req, res) => {
  const { customer_id, start_date, end_date, amount, status } = req.body;

  const sql = `
    INSERT INTO amc_details 
    (customer_id, start_date, end_date, amount, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [customer_id, start_date, end_date, amount, status],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "AMC created successfully" });
    }
  );
};

/* GET AMC LIST */
export const getAmc = (req, res) => {
  const sql = "SELECT * FROM amc_details ORDER BY id DESC";

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(data);
  });
};