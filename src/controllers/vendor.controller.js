import prisma from "../lib/prisma"

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