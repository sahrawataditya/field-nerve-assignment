import express from 'express'
import { createVendor, deleteVendor, deleteVendors, getAllVendors, getVendorById, getVendorDocsById, updateVendor } from '../controllers/vendor.controller'

const router = express.Router()

router.get('/', getAllVendors)
router.get('/:id', getVendorById)
router.get('/docs/:id', getVendorDocsById)
router.post('/create', createVendor)
router.put('/update/:id', updateVendor)
router.delete('/delete/:id', deleteVendor)
router.delete('/delete-all', deleteVendors)

export default router