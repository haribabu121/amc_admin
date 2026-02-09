import { db } from "../config/db.js";

export const getDashboardCounts = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM customer) AS customers,
      (SELECT COUNT(*) FROM services) AS services,
      (SELECT COUNT(*) FROM amc_details) AS amcs
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("DASHBOARD COUNT ERROR:", err);
      return res.status(500).json({ message: "Error fetching counts" });
    }
    res.json(data[0]);
    // console.log("customer",res.data[0]);
    // console.log("services",res.data[0]);
    // console.log("amc",res.data[0]);
  });
};
