import prisma from "../lib/prisma/index.js"

/**
 * @swagger
 * /api/work/create:
 *   post:
 *     summary: Create a new work
 *     tags: [Works]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, location]
 *             properties:
 *               title: { type: string }
 *               category: { type: string, enum: [technology, healthcare, education, finance, retail, logistics] }
 *               location: { type: string }
 *               estimated_value: { type: string }
 *               priority: { type: integer, default: 1 }
 *               expecetedDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Work created
 *       400:
 *         description: Missing fields
 */
//Create Work 
export const createWork = async (req, res) => {
    const { title, category, location, estimated_value, priority, expecetedDate } = req.body
    if (!title || !location) {
        return res.status(400).json({ error: "missing fields!" })
    }
    try {
        await prisma.work.create({
            data: {
                title,
                location,
                category,
                estimated_value,
                expecetedDate,
                priority
            }
        })
        return res.status(200).json({
            messsage: "work created successfully !",
            success: true,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Internal Server Error",
            success: false
        })
    }
}
/**
 * @swagger
 * /api/work/{id}:
 *   get:
 *     summary: Get a work by ID
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Work ID
 *     responses:
 *       200:
 *         description: Work found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage: { type: string }
 *                 success: { type: boolean, enum: [true] }
 *                 data:
 *                   $ref: '#/components/schemas/Work'
 *       404:
 *         description: Work not found
 */
//get signle work 
export const getWorkById = async (req, res) => {
    try {
        const { id } = req?.params

        if (!id) {
            return res.status(400).json({
                error: "id is missing!",
                success: false

            })
        }

        const work = await prisma.work.findUnique({
            where: {
                id
            }
        })

        if (!work) {
            return res.status(404).json({
                error: "work not found !",
                success: false
            })
        }

        return res.status(200).json({
            messsage: "work found !",
            success: true,
            data: work
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Internal Server Error",
            success: false
        })
    }
}

/**
 * @swagger
 * /api/work/all:
 *   get:
 *     summary: Get all works
 *     tags: [Works]
 *     responses:
 *       200:
 *         description: List of works
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage: { type: string }
 *                 success: { type: boolean, enum: [true] }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Work'
 *       404:
 *         description: No works found
 */
//Get all works
export const getAllWorks = async (req, res) => {
    try {
        const works = await prisma.work.findMany()

        if (works?.length <= 0 || !Array.isArray(works)) {
            return res.status(404).json({
                error: "works not found !",
                success: false
            })
        }

        return res.status(200).json({
            messsage: "works found !",
            success: true,
            data: works
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Internal Server Error",
            success: false
        })
    }
}
/**
 * @swagger
 * /api/work/update/{id}:
 *   put:
 *     summary: Update a work by ID
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Work ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               category: { type: string, enum: [technology, healthcare, education, finance, retail, logistics] }
 *               location: { type: string }
 *               estimated_value: { type: string }
 *               priority: { type: integer }
 *               expecetedDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Work updated
 *       404:
 *         description: Work not found
 */
//update work by id 
export const updateWork = async (req, res) => {

    try {
        const { id } = req?.params
        const body = req.body

        if (!id) {
            return res.status(400).json({
                error: "id is missing!",
                success: false

            })
        }

        const work = await prisma.work.findUnique({
            where: {
                id
            }
        })

        if (!work) {
            return res.status(404).json({
                error: "work not found !",
                success: false
            })
        }

        await prisma.work.update({
            where: {
                id
            },
            data: {
                category: body?.category || work?.category,
                estimated_value: body?.estimated_value || work?.estimated_value,
                expecetedDate: body?.expecetedDate || work?.expecetedDate,
                location: body?.location || work?.location,
                priority: body?.priority || work?.priority,
                title: body?.title || work?.title
            }
        })
        return res.status(200).json({
            messsage: "work updated successfully !",
            success: true,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Internal Server Error",
            success: false
        })
    }
}
/**
 * @swagger
 * /api/work/work-recommendation/{workId}:
 *   get:
 *     summary: Get recommended vendors for a work
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema: { type: string }
 *         description: Work ID
 *     responses:
 *       200:
 *         description: Sorted vendor recommendations with scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage: { type: string }
 *                 success: { type: boolean, enum: [true] }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecommendationResult'
 *       404:
 *         description: Work not found
 */
//work recommendation by workId via vendors
export const workRecommendation = async (req, res) => {
    try {
        const { workId } = req?.params

        if (!workId) {
            return res.status(400).json({
                error: "workId is missing!",
                success: false
            })
        }

        const work = await prisma.work.findUnique({
            where: { id: workId }
        })

        if (!work) {
            return res.status(404).json({
                error: "work not found !",
                success: false
            })
        }

        const vendors = await prisma.vendor.findMany({
            include: { documents: true }
        })

        const workLocationWords = work.location.toLowerCase().split(/\s+/)

        const scored = vendors.map((vendor) => {
            let score = 0
            const matched_on = []

            if (vendor.category === work.category) {
                score += 30
                matched_on.push("category")
            }

            if (vendor.operating_location) {
                const vendorWords = vendor.operating_location.toLowerCase().split(/\s+/)
                const locationMatch = vendorWords.some((w) => workLocationWords.includes(w))
                if (locationMatch) {
                    score += 25
                    matched_on.push("location")
                }
            }

            score += (vendor.rating || 0) * 4

            if (vendor.documents?.length > 0) {
                score += 15
                matched_on.push("documents")
            }

            if (vendor.vendor_type) {
                score += 10
                matched_on.push("vendor_type")
            }

            if (vendor.status === "free") {
                score += 20
                matched_on.push("status")
            } else if (vendor.status === "open") {
                score += 10
                matched_on.push("status")
            } else if (vendor.status === "close") {
                score -= 20
            }

            return { vendor, score, matched_on }
        })

        scored.sort((a, b) => b.score - a.score)

        return res.status(200).json({
            messsage: "Recommendations found",
            success: true,
            data: scored
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Internal Server Error",
            success: false
        })
    }
}