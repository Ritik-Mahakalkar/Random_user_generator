const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static images

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789", // change this
  database: "random_users"
});

db.connect((err) => {
  if (err) console.error("DB connection failed:", err);
  else console.log("Connected to MySQL");
});

// Route to upload image and save user
app.post("/api/users", upload.single("photo"), (req, res) => {
  const { fullName, email, phone, city, country } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO users (photo, fullName, email, phone, city, country)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [photoPath, fullName, email, phone, city, country], (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ error: "Insert failed" });
    }
    res.status(201).json({ message: "User stored", userId: result.insertId });
  });
});

// Fetch users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: "Fetch failed" });
    res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
