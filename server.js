import express from 'express'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import multer from 'multer'
import mongoose from 'mongoose'
import userRoutes from './src/routes/users.js'

// Load environment variables
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
  secure: true,
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error))

// Default route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the NauticStar Resource App')
})

// 📌 Endpoint: Fetch all folders
app.get('/cloudinary/folders', async (req, res) => {
  try {
    // Fetch all top-level folders (years)
    const result = await cloudinary.api.sub_folders('nauticstar')

    // Extract available years
    const years = result.folders.map((folder) => folder.name)

    let boats = [] // Placeholder for boat models

    // Fetch boat models for the first available year (default behavior)
    if (years.length > 0) {
      const firstYear = years[0] // Example: "2022"

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
  const { year, boat, type } = req.query

  if (!year || !boat) {
    return res.status(400).json({ error: 'Missing year or boat parameter' })
  }

  const folderPath = `nauticstar/${year}/${boat}`

  let resourceType = 'image'
  if (type) {
    if (type === 'videos') {
      resourceType = 'video'
    } else if (type === 'raw') {
      resourceType = 'raw'
    }
    // Add additional mappings if needed.
  }

  try {
    const result = await cloudinary.search
      .expression(`folder:"${folderPath}" AND resource_type:${resourceType}`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute()

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

    res.json({ assets: result.resources, next_cursor: result.next_cursor })
  } catch (error) {
    console.error('❌ Error fetching all assets:', error)
    res.status(500).json({ error: 'Failed to fetch assets' })
  }
})

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const folderPath = req.body.folder || 'nauticstar/defualt'

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
    })

    res.json(result)
  } catch (error) {
    console.error('upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Mount user routes
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
