import express from 'express'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import multer from 'multer'
import mongoose from 'mongoose'
import userRoutes from './src/routes/users.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// __dirname is not available in ES modules, so we calculate it:
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

// Define your API routes here...
// 📌 Endpoint: Fetch all folders
app.get('/cloudinary/folders', async (req, res) => {
  try {
    const result = await cloudinary.api.sub_folders('nauticstar')
    const years = result.folders.map((folder) => folder.name)
    let boats = []
    if (years.length > 0) {
      const firstYear = years[0]
      const boatResult = await cloudinary.api.sub_folders(`nauticstar/${firstYear}`)
      boats = boatResult.folders.map((folder) => folder.name)
    }
    res.json({ years, boats, types: ['photos', 'videos'] })
  } catch (error) {
    console.error('❌ Error fetching Cloudinary folders:', error)
    res.status(500).json({ error: 'Failed to fetch Cloudinary folders' })
  }
})

// ... other API routes

// Mount user routes
app.use('/api/users', userRoutes)

// Serve static files from the "dist" folder (built Vue app)
app.use(express.static(path.join(__dirname, 'dist')))

// Fallback: For any route not handled above, serve index.html so that the client-side router can handle it.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Use Heroku-assigned port or default to 3001 locally
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
