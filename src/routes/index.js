import express from 'express'
import vendorRouter from './vendor.router'

const router = express.Router()

router.use('/vendor', vendorRouter)

export default router