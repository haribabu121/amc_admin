import express from "express";
import { createAmc, getAmc, getCustomerById} from "../controllers/amc.controller.js";

const router = express.Router();

// Fetch all AMC records
router.get("/", getAmc);

// Create new AMC
router.post("/", createAmc);

// Fetch latest customer for auto-fill
router.get("/customer/:customer_id", getCustomerById);


export default router;