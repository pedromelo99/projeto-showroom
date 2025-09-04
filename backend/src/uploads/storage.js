import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultUploads = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(defaultUploads)) {
    fs.mkdirSync(defaultUploads, { recursive: true });
}

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, defaultUploads);
    },
    filename(_req, file, cb) {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${timestamp}-${safeName}`);
    },
});

export const upload = multer({ storage });

export function buildPublicUrl(filename) {
    return `/uploads/${filename}`;
}


