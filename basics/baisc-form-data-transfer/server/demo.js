import express from 'express'
import cors from 'cors'

const app = express();
const PORT = 4000;

// Allow cross-origin requests from frontend IP 
app.use(cors({
  origin: 'http://localhost:5500', // Frontend IP
}));

// for parsing the body send by fetch
// app.use(express.json());

// parse urlencoded bodies (for HTML forms)
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
  console.log(req.body);
  res.send('Upload successful!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
