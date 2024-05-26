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

  fs.unlink(file.path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File deleted");
    }
  });
  cloudinary.url(uploadResult?.public_id, {
    fetch_format: "auto",
    quality: "60",
  });

  return uploadResult;
};
