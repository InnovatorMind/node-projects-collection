import express from 'express'
import cors from 'cors'
import fs from "fs"

const app = express();
const PORT = 4000;

// Allow cross-origin requests from frontend IP 
app.use(cors({
  origin: 'http://localhost:5500', // Frontend IP
}));

// for parsing the body send by fetch
app.use(express.json());

// parse urlencoded bodies (for HTML forms)
app.use(express.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
  console.log(req.body);
  const contentType = req.headers["content-type"];
  const boundary = "--" + contentType.split("boundary=")[1];

  let chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const buffer = Buffer.concat(chunks);

    // Split parts by boundary
    const parts = buffer
      .toString("binary") // keep binary, but split works with "binary"
      .split(boundary)
      .slice(1, -1); // ignore first empty and last --

    const fields = {};

    parts.forEach((part) => {
      // separate headers from content
      const [rawHeaders, rawBody] = part.split("\r\n\r\n");
      if (!rawBody) return;

      const headers = rawHeaders.split("\r\n").filter(Boolean);

      // Find content-disposition
      const disposition = headers.find((h) =>
        h.startsWith("Content-Disposition")
      );

      if (!disposition) return;

      // Extract name="..."
      const nameMatch = disposition.match(/name="([^"]+)"/);
      const fieldName = nameMatch && nameMatch[1];

      // Check if it’s a file field
      const filenameMatch = disposition.match(/filename="([^"]+)"/);

      if (filenameMatch) {
        // It’s a file
        const filename = filenameMatch[1];

        // Find content-type header (optional)
        const typeHeader = headers.find((h) => h.startsWith("Content-Type"));
        const contentType = typeHeader
          ? typeHeader.split(":")[1].trim()
          : "application/octet-stream";

        // File binary data (trim trailing CRLF)
        const fileData = Buffer.from(
          rawBody,
          "binary"
        ).slice(0, -2); // remove trailing \r\n

        // Save file using write stream
        const writeStream = fs.createWriteStream(`./uploads/${filename}`);
        writeStream.write(fileData);
        writeStream.end();

        console.log(
          `Saved file ${filename} (${contentType}, ${fileData.length} bytes)`
        );
      } else {
        // It’s a normal field
        const value = rawBody.trim(); // remove CRLF
        fields[fieldName] = value;
      }
    });

    console.log("Fields:", fields);
    res.send("Data parsed and file saved manually!");
  });
});

app.listen(4000, () => console.log("Server running on port 4000"));
