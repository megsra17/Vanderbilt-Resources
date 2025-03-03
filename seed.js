// seed.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './src/models/Users.js'

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB')

    // Create a new user instance.
    const user = new User({
      email: 'megan@goredfish.com',
      password: '10fornow', // This will be hashed by the pre-save hook
      name: 'Megan2 Rakow',
      role: 'viewer',
    })

    await user.save()
    console.log('User created successfully')

    // Close the connection once done.
    mongoose.connection.close()
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })
