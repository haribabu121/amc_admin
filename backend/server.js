import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import amcRoutes from "./routes/amc.routes.js";
import serviceRoutes from "./routes/service.route.js";
import customerRoutes from "./routes/customer.routes.js"
import updateamc2 from "./routes/updateamc.routes.js";
import accountRoutes from "./routes/accountRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import path from "path";
dotenv.config();

const app = express();

/* ✅ CORS — MUST BE FIRST */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ✅ Session */
app.use(
  session({
    name: "role-auth-session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
    },
  })
);

/* ✅ Routes */
app.use("/api", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/amc", amcRoutes); // AMC routes
app.use("/api/service", serviceRoutes); // Service routes
app.use("/api/customer",customerRoutes);
app.use("/api/amc-actions",updateamc2);
app.use("/api/account", accountRoutes);
app.use("/api/counts",dashboardRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));



// Debug endpoint
app.get("/api/debug/pdf-path", (req, res) => {
  const path = require("path");
  const fs = require("fs");
  const filePath = path.join(process.cwd(), "config", "Annual Maintanance Contract.pdf");
  res.json({
    cwd: process.cwd(),
    filePath: filePath,
    exists: fs.existsSync(filePath),
    files: fs.readdirSync(path.join(process.cwd(), "config"))
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
