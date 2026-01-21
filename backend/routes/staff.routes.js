import express from "express";
import {
  getStaff,
  createStaff,   // ✅ ADD THIS
  updateStaff,
  deleteStaff
} from "../controllers/staff.controller.js";

const router = express.Router();

router.get("/", getStaff);
router.post("/", createStaff);   // ✅ ADD THIS
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
