import multer from "multer";
import path from "path";

const uploadDirectory = process.env.VERCEL ? "/tmp" : "uploads";

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype !== "application/pdf" || ext !== ".pdf") {
      return cb(new Error("Only PDF resumes are allowed"));
    }
    cb(null, true);
  }
});
