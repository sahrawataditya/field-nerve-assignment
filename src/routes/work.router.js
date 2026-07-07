import express from 'express'
import { getAllVendors } from '../controllers/vendor.controller'
import { createWork, getAllWorks, getWorkById, updateWork, workRecommendation } from '../controllers/work.controller'

const router = express.Router()

router.get('/all', getAllWorks)
router.get('/:id', getWorkById)
router.get('/work-recommendation/:workId', workRecommendation)
router.post('/create', createWork)
router.put('/update/:id', updateWork)

export default router