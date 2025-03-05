import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
})

// Hash password before saving (as before)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

// Generate a password reset token
userSchema.methods.generatePasswordReset = function () {
  // Generate a random token (using crypto)
  const resetToken = crypto.randomBytes(20).toString('hex')
  // Set resetPasswordToken to a hashed version for security
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  // Token expires in 1 hour
  this.resetPasswordExpires = Date.now() + 3600000
  return resetToken
}

export default mongoose.model('User', userSchema)
