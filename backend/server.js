import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import amcRoutes from "./routes/amc.routes.js";
import serviceRoutes from "./routes/service.route.js";

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

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
