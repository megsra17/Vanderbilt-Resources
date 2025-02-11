import { Cloudinary } from '@cloudinary/url-gen'

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dwy5vqsao', // Replace with your Cloudinary cloud name
  },
  url: {
    secure: true, // Ensures HTTPS URLs
  },
})
