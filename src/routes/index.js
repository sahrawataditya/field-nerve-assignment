import express from 'express'
import vendorRouter from './vendor.router'
import documentRouter from './document.router'

const router = express.Router()

router.use('/vendor', vendorRouter)
router.use('/document', documentRouter)

export default router