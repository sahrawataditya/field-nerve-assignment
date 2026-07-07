import express from 'express'
import { uploadDocuments } from '../controllers/document.controller'
import upload from '../middleware/upload'

const router = express.Router()

router.post('/upload/:vendorId', upload.array('documents'), uploadDocuments)

export default router
