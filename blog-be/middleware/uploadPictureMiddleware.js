import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 10000000, // 1MB
  },
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".mp3" &&
      ext !== ".wav" &&
      ext !== ".ogg" &&
      ext !== ".aac" &&
      ext !== ".flac") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

const uploadAudio = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".mp3" &&
      ext !== ".wav" &&
      ext !== ".ogg" &&
      ext !== ".aac" &&
      ext !== ".flac"
    ) {
      return cb(new Error("Only audio files are allowed"));
    }
    cb(null, true);
  },
});

export { uploadPicture, uploadAudio };
