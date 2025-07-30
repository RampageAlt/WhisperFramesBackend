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
  cloud_name: "dn678kfox", // your cloud name
  api_key: "177897192841486", // your API key
  api_secret: "ia8aifblT9WabtUc01H0YSSTxPg" // your API secret
});

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  const publicId = req.body.public_id;

  if (!req.file || !publicId) {
    return res.status(400).json({ error: "Missing file or public_id" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      public_id: publicId,
      overwrite: true
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

// Fixed /photos endpoint to return all image URLs
app.get("/photos", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const urls = result.resources.map(file => file.secure_url);
    res.json(urls);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

