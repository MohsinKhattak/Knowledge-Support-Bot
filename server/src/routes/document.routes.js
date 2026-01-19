import express from "express"
const router=express.Router();
import { createDocument } from '../controllers/document.controller.js';


router.post("/", createDocument);

export default router;