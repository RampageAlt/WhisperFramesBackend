const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const app = express();
const upload = multer();

app.use(cors());

cloudinary.config({
  cloud_name: "dn678kfox",
  api_key: '177897192841486',
  api_secret: 'ia8aifblT9WabtUc01H0YSSTxPg'
});

app.post("/upload", upload.single("file"), (req, res) => {
  const publicId = req.body.public_id;

  if (!req.file || !publicId) {
    return res.status(400).json({ error: "Missing file or public_id" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      public_id: publicId,
      overwrite: true,
      folder: "", // optional: place in subfolder
    },
    (error, result) => {
      if (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(result);
    }
  );

  const stream = Readable.from(req.file.buffer);
  stream.pipe(uploadStream);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
