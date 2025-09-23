import express from 'express'
import cors from 'cors'
import fs from "fs"

const app = express();
const PORT = 4000;

// Allow cross-origin requests from frontend IP 
app.use(cors({
  origin: 'http://localhost:5500', // Frontend IP
}));


app.post('/upload/:filename', (req, res) => {
  const { filename } = req.params;
  const chunkData = fs.createWriteStream(`./uploads/${filename}`);
  req.pipe(chunkData);
  res.send('Upload successful!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
