import multer from 'multer';
import cloudinary from 'cloudinary';
import config from '../config.js';

cloudinary.config({
  cloud_name: config.CLOUDNAME,
  api_key: config.APIKEY,
  api_secret: config.APISECRET,
  secure: true,
});

const storage = multer.memoryStorage();

const multerUploads = multer({ storage }).single('file');

async function uploadFileToCloudinary(file) {
  try {
    const uploaded_file = await cloudinary.v2.uploader.upload(file, {
      resource_type: 'auto',
    });

    const uploadedFileInfo = {
      public_id: uploaded_file.public_id,
      url: uploaded_file.secure_url,
    };

    return uploadedFileInfo;
  } catch (error) {
    throw error;
  }
}

async function deleteFileInCloud(publicId) {
  try {
    if (publicId === 'x1vdmydenrkd3luzvjv6' || publicId === 'file_not_found') {
      return null;
    }

    const deletedFile = await cloudinary.v2.uploader.destroy(publicId);

    return deletedFile;
  } catch (error) {
    throw error;
  }
}

async function processFile(req, res, next) {
  try {
    if (!req.file) {
      return next();
    }

    req.body = { ...req.body, name: req.file.originalname.replace('.pdf', '') };

    const b64 = Buffer.from(req.file.buffer).toString('base64');

    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    const cloudInfo = await uploadFileToCloudinary(dataURI);

    req.file.publicId = cloudInfo.public_id;

    req.file.url = cloudInfo.url;

    return next();
  } catch (error) {
    next(error);
  }
}

export {
  multerUploads,
  processFile,
  deleteFileInCloud,
  uploadFileToCloudinary,
};
