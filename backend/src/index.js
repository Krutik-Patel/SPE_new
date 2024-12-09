const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow React
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Directories
const uploadFolder = path.join(__dirname, '..', 'uploads');
const panoramaFolder = path.join(__dirname, '..', 'uploads', 'panoramas');

if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);
if (!fs.existsSync(panoramaFolder)) fs.mkdirSync(panoramaFolder);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Route: Upload images
app.post('/upload-images', upload.array('images', 10), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' });
    }

    res.status(200).json({
      message: 'Images uploaded successfully!',
      fileDetails: files.map((file) => ({
        filename: file.filename,
        path: file.path,
      })),
    });
  } catch (err) {
    console.error('Error uploading images:', err);
    res.status(500).json({ message: 'Error uploading images.', error: err.message });
  }
});

// Route: Create panorama
app.post('/create-panorama', (req, res) => {
  const scriptPath = path.join(__dirname, '..', '..', 'model', 'src', 'panorama_model.py');

  const python = spawn('python3', [scriptPath, uploadFolder, panoramaFolder]);

  let result = '';
  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error('Error in Python script:', data.toString());
  });

  python.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Error in Python script.' });
    }

    const panoramaPath = result.trim();
    res.status(200).json({ panoramaUrl: `http://localhost:5000/uploads/panoramas/${path.basename(panoramaPath)}` });
  });
});

// Serve static files
app.use('/uploads', express.static(uploadFolder));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




// const express = require('express');
// const cors = require('cors'); // Import CORS
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const { spawn } = require('child_process');

// const app = express();
// const PORT = 5000;

// // Allow requests from React (http://localhost:3000)
// app.use(cors({ origin: 'http://localhost:3000' }));

// // Middleware for parsing JSON and form data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Upload configuration
// const uploadFolder = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadFolder),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Route: Upload images
// app.post('/upload-images', upload.array('images', 10), (req, res) => {
//   try {
//     const files = req.files;
//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: 'No images uploaded.' });
//     }

//     res.status(200).json({
//       message: 'Images uploaded successfully!',
//       fileDetails: files.map((file) => ({
//         filename: file.filename,
//         path: file.path,
//       })),
//     });
//   } catch (err) {
//     console.error('Error uploading images:', err);
//     res.status(500).json({ message: 'Error uploading images.', error: err.message });
//   }
// });

// // Route: Get random image via Python script
// app.get('/random-image', (req, res) => {
//   const scriptPath = path.join(__dirname, 'src', 'sample_model.py');
//   const uploadsPath = path.join(__dirname, 'uploads');

//   const python = spawn('python3', [scriptPath, uploadsPath]);

//   let result = '';
//   python.stdout.on('data', (data) => {
//     result += data.toString();
//   });

//   python.stderr.on('data', (data) => {
//     console.error('Error in Python script:', data.toString());
//   });

//   python.on('close', (code) => {
//     if (code !== 0) {
//       return res.status(500).json({ message: 'Error in Python script.' });
//     }

//     const randomImage = result.trim();
//     res.status(200).json({ randomImage: `http://localhost:5000/uploads/${randomImage}` });
//   });
// });

// // Serve static files from uploads folder
// app.use('/uploads', express.static(uploadFolder));

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
