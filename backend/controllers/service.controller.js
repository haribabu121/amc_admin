import { db } from "../config/db.js";

/* CREATE SERVICE */
export const createService = (req, res) => {
  const { service_name, service_cost, service_date, service_type  } = req.body;

  const sql = `
    INSERT INTO services 
    (service_name,  service_cost ,service_date,  service_type)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [service_name, service_cost, service_date, service_type],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Service created successfully" });
    }
  );
};

/* GET SERVICE LIST */
export const getService = (req, res) => {
  const sql = "SELECT * FROM services ORDER BY id DESC";

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(data);
  });
};