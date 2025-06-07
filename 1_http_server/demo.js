// import { response } from 'express';
import http from 'node:http'
import fs from 'fs';
import path from 'path';

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(req.url=='/favicon.ico'?"":req.url)

  let filePath = '';
  switch (req.url) {
    case '/':
      filePath = './pages/index.html';
      break;
    case '/about':
      filePath = './pages/about.html';
      break;
    case '/contact':
      filePath = './pages/contact.html';
      break;
    default:
      filePath = './pages/404.html';
      break;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('500 - Internal Server Error');
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
