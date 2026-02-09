import { getDashboardCounts } from "../controllers/dashboardController.js";
import express from "express";
const router = express.Router();

router.get("/", getDashboardCounts);

export default router;