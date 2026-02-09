// import { db } from "../config/db.js";
// import path from "path";
// export const downloadPdf = (req, res) => {
//   const { amc_id } = req.params;

//   // SAMPLE PDF (use your real PDF later)
//   const filePath = path.join(process.cwd(), "sample.pdf");

//   res.download(filePath, `amc_${amc_id}.pdf`);
// };
/* CREATE AMC */
import { db } from "../config/db.js";
export const getLatestCustomer = (req, res) => {
  const sql = `
    SELECT 
      c.customer_id,
      c.name,
      s.service_name,
      s.service_cost,
      c.advance_payment
    FROM customer c
    JOIN services s ON c.service_id = s.id
    ORDER BY c.customer_id DESC
    LIMIT 1
  `;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data[0] || {});
  });
};

/* ================= GET FIRST CUSTOMER FOR AUTO-FILL ================= */
export const getCustomerById = (req, res) => {
  const { customer_id } = req.params;

  const sql = `
    SELECT 
      c.customer_id,
      c.name,
      s.service_name,
      s.service_cost,
      c.advance_payment
    FROM customer c
    JOIN services s ON c.service_id = s.id
    WHERE c.customer_id = ?
  `;

  db.query(sql, [customer_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "Customer not found" });

    res.json(data[0]);
  });
};
/* ================= CREATE AMC ================= */
export const createAmc = (req, res) => {
  const {
    customer_id,
    name,
    service_name,
    service_cost,
    advance_payment,
    remaining_balance,
    status,
    start_date,
    end_date,
  } = req.body;

  const sql = `
    INSERT INTO amc_details
      (customer_id, name, service_name, service_cost, advance_payment, remaining_balance, status, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customer_id,
    name,
    service_name,
    service_cost,
    advance_payment,
    remaining_balance,
    status,
    start_date,
    end_date,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("AMC INSERT ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "AMC created successfully" });
  });
};

/* ================= GET ALL AMC ================= */
export const getAmc = (req, res) => {
  db.query("SELECT * FROM amc_details ORDER BY amc_id DESC", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};
