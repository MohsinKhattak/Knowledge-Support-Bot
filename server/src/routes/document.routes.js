import express from "express"
const router = express.Router();
import { createDocument } from '../controllers/document.controller.js';
import { upload } from '../config/multer.js';

router.post("/", upload.single("file"), createDocument);

export default router;