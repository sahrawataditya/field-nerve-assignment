import express from 'express'
import vendorRouter from './vendor.router'
import documentRouter from './document.router'
import workRouter from './work.router'

const router = express.Router()

router.use('/vendor', vendorRouter)
router.use('/document', documentRouter)
router.use('/work', workRouter)

export default router