import express from "express";
import {
  createAmc,
  getAmc,

} from "../controllers/amc.controller.js";

const router = express.Router();

router.post("/", createAmc);
router.get("/", getAmc);


export default router;
