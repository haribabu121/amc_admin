import express from "express";
import {
  updateAmc,
  downloadPdf,deleteAmc
} from "../controllers/amc1.controller.js";
const router = express.Router();
router.put("/:amc_id", updateAmc);
router.get("/pdf/:amc_id", downloadPdf);
router.delete("/:amc_id", deleteAmc);
export default router; 