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
    // Fetch all top-level folders (years)
    const result = await cloudinary.api.sub_folders('nauticstar')

    console.log(
      '📂 Available Folders:',
      result.folders.map((folder) => folder.path),
    )

    // Extract available years
    const years = result.folders.map((folder) => folder.name)

    let boats = [] // Placeholder for boat models

    // Fetch boat models for the first available year (default behavior)
    if (years.length > 0) {
      const firstYear = years[0] // Example: "2022"
      console.log(`📁 Fetching boats inside nauticstar/${firstYear}`)

      const boatResult = await cloudinary.api.sub_folders(`nauticstar/${firstYear}`)
      boats = boatResult.folders.map((folder) => folder.name) // Extract boat names
    }

    res.json({
      years,
      boats,
      types: ['photos', 'videos'], // Keep types for now
    })
  } catch (error) {
    console.error('❌ Error fetching Cloudinary folders:', error)
    res.status(500).json({ error: 'Failed to fetch Cloudinary folders' })
  }
})

// Endpoint: Fetch boat folders for a specific year
app.get('/cloudinary/list-subfolders', async (req, res) => {
  const { year } = req.query
  console.log(`Fetching subfolders for nauticstar/${year}`)
  try {
    const result = await cloudinary.api.sub_folders(`nauticstar/${year}`)
    res.json({ subfolders: result.folders })
  } catch (error) {
    console.error('Error fetching subfolders:', error)
    res.status(500).json({ error: 'Failed to fetch subfolders' })
  }
})

// 📌 Endpoint: Fetch images from a specific folder
app.get('/cloudinary/images', async (req, res) => {
  const { year, boat } = req.query

  console.log(`📩 Received API Request - Year: ${year}, Boat: ${boat}`)

  if (!year || !boat) {
    return res.status(400).json({ error: 'Missing year or type parameter' })
  }

  const folderPath = `nauticstar/${year}/${boat}`
  console.log(`🔍 Searching Cloudinary folder: ${folderPath}`)

  try {
    const result = await cloudinary.search
      .expression(`folder:"${folderPath}" AND resource_type:image`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute()

    console.log(
      '📸 Cloudinary Search API Response:',
      result.resources.map((img) => img.secure_url),
    )

    res.json({ images: result.resources })
  } catch (error) {
    console.error('❌ Error searching Cloudinary:', error)
    res.status(500).json({ error: 'Failed to search Cloudinary images' })
  }
})

// 📌 Endpoint: Fetch all assets
app.get('/cloudinary/all-assets', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: 'image', // Only images will be fetched
      max_results: 100,
    })
    console.log('📂 All image assets:', result.resources)
    res.json({ assets: result.resources, next_cursor: result.next_cursor })
  } catch (error) {
    console.error('❌ Error fetching all assets:', error)
    res.status(500).json({ error: 'Failed to fetch assets' })
  }
})

app.listen(3001, () => console.log('Server running on port 3001'))
