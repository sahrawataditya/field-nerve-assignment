import prisma from "../lib/prisma"

/**
 * @swagger
 * /api/vendor/create:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               category: { type: string, enum: [technology, healthcare, education, finance, retail, logistics] }
 *               operating_location: { type: string }
 *               status: { type: string, enum: [free, open, close] }
 *               rating: { type: integer, minimum: 0, maximum: 10 }
 *               vendor_type: { type: string }
 *     responses:
 *       200:
 *         description: Vendor created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage: { type: string }
 *                 success: { type: boolean, enum: [true] }
 *       400:
 *         description: Missing fields or vendor already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
//Create vendor 
export const createVendor = async (req, res) => {
    const { name, email, category, operating_location, status, rating, vendor_type } = req.body
    if (!name || !email) {
        return res.status(400).json({ error: "missing fields!" })
    }
    try {
        const vendor = await prisma.vendor.findUnique({
            where: {
                email
            }
        })

        if (vendor) {
            return res.status(400).json({
                error: "vendor already exists!",
                success: false
            })
        }
        await prisma.vendor.create({
            data: {
                email,
                name,
                category,
                operating_location,
                status,
                rating,
                vendor_type
            }
        })
        return res.status(200).json({
            messsage: "vendor created successfully !",
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
 * /api/vendor:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of vendors
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
 *                     $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: No vendors found
 */
//get all vendors 
export const getAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany()

        if (vendors?.length <= 0 || !Array.isArray(vendors)) {
            return res.status(404).json({
                error: "vendors not found !",
                success: false
            })
        }

        return res.status(200).json({
            messsage: "vendors found !",
            success: true,
            data: vendors
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
 * /api/vendor/{id}:
 *   get:
 *     summary: Get a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage: { type: string }
 *                 success: { type: boolean, enum: [true] }
 *                 data:
 *                   $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: Vendor not found
 */
//get signle vendor 
export const getVendorById = async (req, res) => {
    try {
        const { id } = req?.params

        if (!id) {
            return res.status(400).json({
                error: "id is missing!",
                success: false

            })
        }

        const vendor = await prisma.vendor.findUnique({
            where: {
                id
            }
        })

        if (!vendor) {
            return res.status(404).json({
                error: "vendor not found !",
                success: false
            })
        }

        return res.status(200).json({
            messsage: "vendor found !",
            success: true,
            data: vendor
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
 * /api/vendor/update/{id}:
 *   put:
 *     summary: Update a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vendor ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               category: { type: string, enum: [technology, healthcare, education, finance, retail, logistics] }
 *               operating_location: { type: string }
 *               status: { type: string, enum: [free, open, close] }
 *               rating: { type: integer, minimum: 0, maximum: 10 }
 *               vendor_type: { type: string }
 *     responses:
 *       200:
 *         description: Vendor updated
 *       400:
 *         description: Missing ID
 *       404:
 *         description: Vendor not found
 */
//update vendor by id 
export const updateVendor = async (req, res) => {

    try {
        const { id } = req?.params
        const body = req.body

        if (!id) {
            return res.status(400).json({
                error: "id is missing!",
                success: false

            })
        }

        const vendor = await prisma.vendor.findUnique({
            where: {
                id
            }
        })

        if (!vendor) {
            return res.status(404).json({
                error: "vendor not found !",
                success: false
            })
        }

        await prisma.vendor.update({
            where: {
                id
            },
            data: {
                email: body?.email || vendor?.email,
                name: body?.name || vendor?.name,
                category: body?.category || vendor?.category,
                operating_location: body?.operating_location || vendor?.operating_location,
                status: body?.status || vendor?.status,
                rating: body?.rating || vendor?.rating,
                vendor_type: body?.vendor_type || vendor?.vendor_type
            }
        })
        return res.status(200).json({
            messsage: "vendor updated successfully !",
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
 * /api/vendor/delete/{id}:
 *   delete:
 *     summary: Delete a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor deleted
 *       404:
 *         description: Vendor not found
 */
//delete vendor by id 
export const deleteVendor = async (req, res) => {

    try {
        const { id } = req?.params

        if (!id) {
            return res.status(400).json({
                error: "id is missing!",
                success: false

            })
        }

        const vendor = await prisma.vendor.findUnique({
            where: {
                id
            }
        })

        if (!vendor) {
            return res.status(404).json({
                error: "vendor not found !",
                success: false
            })
        }

        await prisma.vendor.delete({
            where: {
                id
            },
        })

        await prisma.document.deleteMany({
            where: {
                vendorId: id
            }
        })
        return res.status(200).json({
            messsage: "vendor deleted successfully !",
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
 * /api/vendor/delete-all:
 *   delete:
 *     summary: Delete all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: All vendors deleted
 *       404:
 *         description: No vendors found
 */
//delete all vendors 
export const deleteVendors = async (req, res) => {

    try {
        const vendors = await prisma.vendor.findMany()

        if (vendors?.length <= 0 || !Array.isArray(vendors)) {
            return res.status(404).json({
                error: "vendors not found !",
                success: false
            })
        }
        await prisma.vendor.deleteMany()

        await prisma.document.deleteMany()

        return res.status(200).json({
            messsage: "vendors deleted successfully !",
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
 * /api/vendor/docs/{id}:
 *   get:
 *     summary: Get all documents for a vendor
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor documents found
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
 *                     type: object
 *                     properties:
 *                       doc_url: { type: string, format: uri }
 *                       name: { type: string }
 *       404:
 *         description: Vendor or documents not found
 */
//get all vendors docs by vendor id 
export const getVendorDocsById = async (req, res) => {
    try {
        const { id } = req?.params

        if (!id) {
            return res.status(400).json({
                error: "id is missing!",
                success: false

            })
        }

        const vendor = await prisma.vendor.findUnique({
            where: {
                id
            }
        })

        if (!vendor) {
            return res.status(404).json({
                error: "vendor not found !",
                success: false
            })
        }
        const docs = await prisma.document.findMany({
            where: {
                vendorId: id
            },
            select: {
                doc_url: true,
                name: true
            }
        })
        if (docs?.length <= 0 || !Array.isArray(docs)) {
            return res.status(404).json({
                error: "vendors docs not found !",
                success: false
            })
        }
        return res.status(200).json({
            messsage: "vendor docs found !",
            success: true,
            data: docs
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Internal Server Error",
            success: false
        })
    }
}