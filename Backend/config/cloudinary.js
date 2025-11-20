import {v2 as cloudinary } from "cloudinary"

const connectCloudinary = async () => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
        timeout: 10000, // 10 seconds timeout
        secure: true // Use HTTPS
    })

    console.log('Cloudinary configured successfully');

}

export default connectCloudinary;