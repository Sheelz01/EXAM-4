const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const uploadToCloudinary = async (buffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

exports.uploadSingle = async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadArray = async (req, res) => {
  try {
    const uploads = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );
    res.json({ urls: uploads.map(u => u.secure_url) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadMultipleFields = async (req, res) => {
  try {
    const results = {};
    const fields = Object.keys(req.files);
    for (let field of fields) {
      results[field] = await Promise.all(
        req.files[field].map(file => uploadToCloudinary(file.buffer))
      );
    }
    res.json({
      uploads: Object.fromEntries(
        Object.entries(results).map(([k, v]) => [k, v.map(x => x.secure_url)])
      )
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
