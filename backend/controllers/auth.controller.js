import { db } from "../config/db.js";
// export const register = (req, res) => {
//   const { name, phone, registration, password } = req.body;

//   const sql = "INSERT INTO customer_data (name, phone, registration, password, role) VALUES (?,?,?,?,?)";
//   db.query(sql, [name, phone, registration, password, "customer"], (err) => {
//     if (err) return res.status(400).json(err);
//     res.json({ message: "Registered Successfully" });
//   });
// };

export const login = (req, res) => {
  const { registration, password } = req.body;

  const sql = "SELECT * FROM customer_data WHERE Registration=?";

  db.query(sql, [registration], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const user = result[0];

    // Plain-text comparison (OK for now)
    if (password !== user.Password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    req.session.user = {
      id: user.id,
      role: user.Role,
    };

    res.json({ Role: user.Role });
  });
};

export const createStaff = (req, res) => {
  const { name, phone, email, password } = req.body;

  const sql = "INSERT INTO staff_dashboard (name, phone, email, password, role) VALUES (?,?,?,?,?)";
  db.query(sql, [name, phone, email, password, "staff"], (err) => {
    if (err) return res.status(400).json(err);
    res.json({ message: "Staff Created" });
  });
};

export const logout = (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged Out" }));
};
