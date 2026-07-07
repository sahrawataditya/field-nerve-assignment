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