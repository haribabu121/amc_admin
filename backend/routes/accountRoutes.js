import express from "express";
import {
  createAccount,
  getAccounts,
  upload,getLatestAmcCustomer
} from "../controllers/accountController.js";

const router = express.Router();

router.post("/", upload.single("profile"), createAccount);
router.get("/", getAccounts);
router.get("/latest-customer",getLatestAmcCustomer)

export default router;
