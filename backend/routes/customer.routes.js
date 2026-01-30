import express from "express";
import {
  createCustomer,getCustomers

} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/", createCustomer);
router.get("/",getCustomers);
// router.get("/customer-details", getCustomerWithService);



export default router;
