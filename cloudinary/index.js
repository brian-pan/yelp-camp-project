const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//instantiate cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary, 
    folder: 'YelpCamp', //folder in cloud we store things in
    allowedFormats: ['jpeg', 'png', 'jpg']
});

module.exports = {
    cloudinary,
    storage
}