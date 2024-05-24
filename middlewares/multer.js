import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/profile/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + "-" + ".jpg");
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 },
});
