import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [panorama, setPanorama] = useState(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files); // Show selected image names
  };

  const uploadImages = () => {
    const formData = new FormData();
    selectedImages.forEach((file) => formData.append('images', file));

    axios
      .post('http://localhost:5000/upload-images', formData)
      .then((res) => {
        console.log('Images uploaded:', res.data);
        setImages(res.data.fileDetails); // Update the list of uploaded images
        alert('Images uploaded successfully!');
      })
      .catch((err) => {
        console.error('Error uploading images:', err);
        alert('Error uploading images.');
      });
  };

  const createPanorama = () => {
    axios
      .post('http://localhost:5000/create-panorama')
      .then((res) => {
        console.log('Panorama created:', res.data);
        setPanorama(res.data.panoramaUrl); // Get the panorama URL
      })
      .catch((err) => {
        console.error('Error creating panorama:', err);
        alert('Error creating panorama.');
      });
  };

  return (
    <div className="App">
      <h1>Panorama Creation</h1>

      <div className="upload-section">
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          accept="image/*"
        />
        <button onClick={uploadImages}>Upload Images</button>
      </div>

      <div className="image-list">
        <h3>Selected Images:</h3>
        <ul>
          {selectedImages.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>

      <button onClick={createPanorama} disabled={images.length < 2}>
        Create Panorama
      </button>

      {panorama && (
        <div className="panorama-section">
          <h3>Generated Panorama:</h3>
          <img
            src={panorama}
            alt="Panorama"
            className="panorama-image"
          />
        </div>
      )}
    </div>
  );
};

export default App;



// import React, { useState } from 'react';
// import axios from 'axios';

// const App = () => {
//   const [images, setImages] = useState([]);
//   const [randomImage, setRandomImage] = useState(null);

//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);
//     const formData = new FormData();
//     files.forEach((file) => formData.append('images', file));

//     axios
//       .post('http://localhost:5000/upload-images', formData)
//       .then((res) => {
//         console.log('Images uploaded:', res.data);
//         setImages(res.data.fileDetails);
//       })
//       .catch((err) => {
//         console.error('Error uploading images:', err);
//       });
//   };

//   const fetchRandomImage = () => {
//     axios
//       .get('http://localhost:5000/random-image')
//       .then((res) => {
//         console.log('Random image:', res.data);
//         setRandomImage(res.data.randomImage);
//       })
//       .catch((err) => {
//         console.error('Error fetching random image:', err);
//       });
//   };

//   return (
//     <div>
//       <h1>Image Uploader</h1>
//       <input type="file" multiple onChange={handleImageUpload} />
//       <button onClick={fetchRandomImage}>Get Random Image</button>

//       {randomImage && (
//         <div>
//           <h2>Random Image</h2>
//           <img src={randomImage} alt="Random" style={{ maxWidth: '100%', height: 'auto' }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
