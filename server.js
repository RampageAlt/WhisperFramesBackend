const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: "dn678kfox",
  api_key: '177897192841486',
  api_secret: 'ia8aifblT9WabtUc01H0YSSTxPg'
});

app.post("/upload", upload.single("file"), (req, res) => {
  const publicId = req.body.public_id || undefined;

  if (!req.file) {
    return res.status(400).json({ error: "Missing file" });
  }

  const uploadOptions = {
    overwrite: true,
    folder: "", // Add folder name if needed, else leave blank
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    uploadOptions,
    (error, result) => {
      if (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json({ url: result.secure_url, public_id: result.public_id });
    }
  );

  Readable.from(req.file.buffer).pipe(uploadStream);
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
