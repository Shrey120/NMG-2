import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

// Optional photo on an enquiry. Saved into server/uploads and served back
// from /uploads. A real deployment would put these in object storage instead.
const uploadsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), 'uploads');

const storage = multer.diskStorage({
  destination: uploadsFolder,
  filename: (req, file, done) => {
    // Never trust the name the browser sends. Build our own from the time
    // plus the original extension.
    const safeExtension = path.extname(file.originalname).toLowerCase().slice(0, 5);
    done(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${safeExtension}`);
  },
});

export const uploadsPath = uploadsFolder;

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, done) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    done(null, allowed.includes(file.mimetype));
  },
}).single('photo');
