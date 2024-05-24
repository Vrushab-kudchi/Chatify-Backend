import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadFile = async (file) => {
  const uploadResult = await cloudinary.uploader
    .upload(file?.path)
    .catch((error) => {
      console.log(error);
    });

  const optimizeUrl = cloudinary.url(uploadResult?.public_id, {
    fetch_format: "auto",
    quality: "60",
  });
  fs.unlink(file.path, (err) => {
    console.log("Error to delete file", err);
  });

  return uploadResult;
};
