import { db } from "../config/db.js";
export const createStaff = (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO staff_dashboard (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'staff')";

  db.query(query, [name, email, phone, password], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      id: result.insertId,
    });
  });
};


/**
 * GET ONLY STAFF
 */
export const getStaff = (req, res) => {
  const query = "SELECT id, name, email, phone, role FROM staff_dashboard WHERE role = 'staff'";
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/**
 * UPDATE STAFF
 */
export const updateStaff = (req, res) => {
  const { name, email, phone } = req.body;
  const { id } = req.params;

  const query =
    "UPDATE staff_dashboard SET name = ?, email = ?, phone = ? WHERE id = ? AND role = 'staff'";

  db.query(query, [name, email, phone, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, message: "Staff updated successfully" });
  });
};

/**
 * DELETE STAFF
 */
export const deleteStaff = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM staff_dashboard WHERE id = ? AND role = 'staff'";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, message: "Staff deleted successfully" });
  });
};
