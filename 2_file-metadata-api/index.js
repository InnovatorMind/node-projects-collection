import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

const app = express();
const PORT = 3000;

// Configure storage for multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Home route to upload file via form
app.get('/', (req, res) => {
  res.send(`
    <h2>Upload a file</h2>
    <form method="POST" enctype="multipart/form-data" action="/upload">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// API route to upload and get metadata
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const metadata = {
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype
  };

  res.json(metadata);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
