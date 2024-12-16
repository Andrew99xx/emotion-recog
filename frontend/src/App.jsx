import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import external CSS

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error during prediction. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Emotion Recognition</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {previewURL && (
          <div className="image-preview">
            <h3>Image Preview:</h3>
            <img src={previewURL} alt="Uploaded Preview" className="preview-image" />
          </div>
        )}

        <button type="submit" className="submit-button">
          Upload and Predict
        </button>
      </form>

      {prediction && (
        <div className="prediction-result">
          <h2>This person is probably: {prediction}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
