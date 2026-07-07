import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
})

export function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'raw', folder: 'documents', ...options },
      (err, result) => {
        if (err) return reject(err)
        resolve(result)
      },
    )
    stream.end(buffer)
  })
}
