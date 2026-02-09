import { db } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

/* ================= ENSURE UPLOADS FOLDER ================= */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

/* ================= CREATE ACCOUNT ================= */
export const createAccount = (req, res) => {
  const { customer_no,company_name, account_no, ifsc, bank, branch } = req.body;
  const profile = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO account_details
    (customer_no,company_name, account_no, ifsc, bank, branch, profile)
    VALUES (?,?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [customer_no,company_name, account_no, ifsc, bank, branch, profile],
    (err) => {
      if (err) {
        console.error("ACCOUNT INSERT ERROR:", err);
        return res.status(500).json({ message: "Insert failed" });
      }
      res.json({ message: "Account created successfully" });
    }
  );
};

/* ================= GET ACCOUNTS ================= */
export const getAccounts = (req, res) => {
  db.query(
    "SELECT * FROM account_details ORDER BY id DESC",
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
};


export const getLatestAmcCustomer = (req, res) => {
  const sql = `
    SELECT customer_id 
    FROM amc_details 
    ORDER BY amc_id DESC 
    LIMIT 1
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("FETCH AMC CUSTOMER ERROR:", err);
      return res.status(500).json({ message: "Fetch failed" });
    }

    res.json(data[0] || {});
  });
};