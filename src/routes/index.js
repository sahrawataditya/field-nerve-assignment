import express from 'express'
import vendorRouter from './vendor.router.js'
import documentRouter from './document.router.js'
import workRouter from './work.router.js'

const router = express.Router()

router.use('/vendor', vendorRouter)
router.use('/document', documentRouter)
router.use('/work', workRouter)

export default router