import { db } from "../config/db.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= PDF DOWNLOAD / OPEN ================= */
export const downloadPdf = (req, res) => {
  const { amc_id } = req.params;

  // Build path from current file location: controllers/../config/Annual Maintanance Contract.pdf
  const filePath = path.resolve(__dirname, "..", "config", "Annual Maintanance Contract.pdf");

  console.log("=== PDF REQUEST FOR AMC ID:", amc_id, "===");
  console.log("__dirname:", __dirname);
  console.log("Resolved filePath:", filePath);
  console.log("File exists:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    console.error("❌ FILE NOT FOUND");
    
    // Debug: list directory contents
    const configPath = path.resolve(__dirname, "..", "config");
    console.log("Contents of", configPath, ":");
    try {
      const files = fs.readdirSync(configPath);
      files.forEach(f => {
        const fullPath = path.join(configPath, f);
        const stats = fs.statSync(fullPath);
        console.log(`  - ${f} (${stats.size} bytes)`);
      });
    } catch (e) {
      console.error("Could not list directory:", e.message);
    }
    
    return res.status(404).json({ message: "PDF file not found" });
  }

  console.log("✅ File found! Sending...");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="amc_${amc_id}.pdf"`);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("❌ Error sending file:", err.message);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error sending file" });
      }
    } else {
      console.log("✅ File sent successfully");
    }
  });
};
/* UPDATE AMC DATES — ✅ FIXED */
export const updateAmc = (req, res) => {
  const { amc_id } = req.params;
  const { start_date, end_date } = req.body;

  console.log("=== UPDATE REQUEST ===");
  console.log("AMC ID:", amc_id);
  console.log("Start Date:", start_date);
  console.log("End Date:", end_date);

  if (!amc_id || !start_date || !end_date) {
    return res.status(400).json({
      message: "AMC ID, start_date, and end_date are required",
    });
  }

  const sql = `
    UPDATE amc_details
    SET start_date = ?, end_date = ?
    WHERE amc_id = ?
  `;

  db.query(sql, [start_date, end_date, amc_id], (err, result) => {
    if (err) {
      console.error("DATABASE ERROR:", err);
      return res.status(500).json({
        message: "Database error",
        error: err.message,
      });
    }

    console.log("UPDATE SUCCESS");

    // ✅ RETURN SAME STRINGS — NO Date()
    res.json({
      message: "AMC updated successfully",
      data: {
        amc_id,
        start_date,
        end_date,
      },
    });
  });
};

export const deleteAmc = (req, res) => {
  const { amc_id } = req.params;
  console.log(req.params);

  const query = "DELETE FROM amc_details WHERE amc_id = ?";

  db.query(query, [amc_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, message: "Staff deleted successfully" });
  });
};
