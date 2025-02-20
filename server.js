import express from 'express'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
app.use(cors())

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
  secure: true,
})

// 📌 Endpoint: Fetch all folders
app.get('/cloudinary/folders', async (req, res) => {
  try {
    const result = await cloudinary.api.root_folders()

    res.json({
      years: result.folders.map((folder) => folder.name),
      boats: ['Speed Boat', 'Yacht'], // Example boats
      types: ['photos', 'videos'], // Example types
    })
  } catch (error) {
    console.error('Error fetching folders:', error)
    res.status(500).json({ error: 'Failed to fetch Cloudinary folders' })
  }
})

// 📌 Endpoint: Fetch images from a specific folder
app.get('/cloudinary/images', async (req, res) => {
  const { year, type } = req.query
  if (!year || !type) {
    return res.status(400).json({ error: 'Missing year or type parameter' })
  }

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `nauticstar/${year}/${type}`,
      max_results: 50,
    })

    res.json({ images: result.resources })
  } catch (error) {
    console.error('Error fetching images:', error)
    res.status(500).json({ error: 'Failed to fetch Cloudinary images' })
  }
})

app.listen(3001, () => console.log('Server running on port 3001'))
