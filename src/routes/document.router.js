import express from 'express'
import { uploadDocuments } from '../controllers/document.controller.js'
import upload from '../middleware/upload.js'
import { createRequire } from 'module';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const router = express.Router()

router.post('/upload/:vendorId', upload.array('documents'), uploadDocuments)

export default router;
