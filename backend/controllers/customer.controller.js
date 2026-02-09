import { db } from "../config/db.js";

/* ================= CREATE CUSTOMER ================= */
export const createCustomer = (req, res) => {
  const {
    name,
    phonenumber,
    address,
    email,
    service_id,
    gst_no,
    advance_payment,
    purchase_date,
  } = req.body;
console.log(req.body);
  if (!name || !phonenumber || !service_id || !purchase_date || !gst_no) {
    return res.status(400).json({
      message: "Name, phone, service, and purchase date,gst_no are required",
    });
  }

  // 🔹 STEP 1: get last customer_id
  const getLastIdSql =
    "SELECT customer_id FROM customer ORDER BY customer_id DESC LIMIT 1";

  db.query(getLastIdSql, (err, rows) => {
    if (err) {
      console.error("ID FETCH ERROR:", err.sqlMessage);
      return res.status(500).json({ message: err.sqlMessage });
    }

    // 🔹 STEP 2: generate new customer_id
    let customer_id = "cs-1";

    if (rows.length > 0) {
      const lastNum = parseInt(rows[0].customer_id.split("-")[1], 10);
      customer_id = `cs-${lastNum + 1}`;
    }

    // 🔹 STEP 3: insert customer
    const insertSql = `
      INSERT INTO customer
      (customer_id, name, phonenumber, address, email, service_id, gst_no, advance_payment, purchase_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    db.query(
      insertSql,
      [
        customer_id,
        name.trim(),
        phonenumber.trim(),
        address || null,
        email || null,
        Number(service_id),
        gst_no || null,
        Number(advance_payment || 0),
        purchase_date,
      ],
      (err) => {
        if (err) {
          console.error("MYSQL INSERT ERROR:", err.sqlMessage);
          return res.status(500).json({ message: err.sqlMessage });
        }

        res.status(201).json({
          message: "Customer created successfully",
          customer_id,
        });
      }
    );
  });
};

/* ================= GET CUSTOMERS ================= */
export const getCustomers = (req, res) => {
  const sql = `
    SELECT
      c.customer_id,
      c.name,
      c.phonenumber,
      c.email,
      c.address,
      c.advance_payment,
      c.purchase_date,
      c.gst_no,
      s.service_name
    FROM customer c
    LEFT JOIN services s ON c.service_id = s.id
    ORDER BY c.customer_id DESC
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("MYSQL FETCH ERROR:", err.sqlMessage);
      return res.status(500).json({
        message: err.sqlMessage,
      });
    }

    res.json(data);
  });
};
