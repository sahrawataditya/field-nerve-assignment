import prisma from '../lib/prisma'
import { uploadToCloudinary } from '../lib/cloudinary'

export const uploadDocuments = async (req, res) => {
  const { vendorId } = req.params
  const files = req.files

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files provided', success: false })
  }

  if (!vendorId) {
    return res.status(400).json({ error: 'Vendor ID is required', success: false })
  }

  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } })
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found', success: false })
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, {
          public_id: file.originalname.replace(/\.[^/.]+$/, ''),
          resource_type: 'raw',
        })

        return prisma.document.create({
          data: {
            name: file.originalname,
            doc_url: result.secure_url,
            vendorId,
          },
        })
      }),
    )

    return res.status(201).json({
      message: 'Documents uploaded successfully',
      success: true,
      data: uploadResults,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error', success: false })
  }
}
