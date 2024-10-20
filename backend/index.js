const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const parseTransactions = require("./parsetransaction");

const app = express();
const PORT = 3000;

// Check and create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files

// Set up file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Route for uploading the file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Serve the HTML form
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log("Uploaded file details:", req.file); // Log the uploaded file

    const filePath = req.file.path; // Get the path of the uploaded file
    const transactions = parseTransactions(filePath); // Parse the transactions
    console.log("Parsed transactions:", transactions); // Log the parsed transactions

    res.json(transactions); // Send JSON response
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Failed to process file." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
