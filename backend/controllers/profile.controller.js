import { db } from "../db.js";

export const getProfile = (req, res) => {
  db.query(
    "SELECT id, name, email, phone FROM users WHERE id=?",
    [req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result[0]);
    }
  );
};

export const updateProfile = (req, res) => {
  const { name, phone } = req.body;

  db.query(
    "UPDATE users SET name=?, phone=? WHERE id=?",
    [name, phone, req.userId],
    () => res.json({ message: "Profile updated" })
  );
};
