import express from "express";
import { submitForm } from "../controllers/formController.js";

const router = express.Router();

router.post("/submit-form", submitForm);

export default router;
