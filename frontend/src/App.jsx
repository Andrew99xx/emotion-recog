import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import external CSS
import { notification } from "antd";function App() {
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
      notification.warning({
        message: 'No Image Selected',
        description: "Please select a Image to predict",
        placement: 'topRight',
        duration: 3, // Display for 3 seconds
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const backendUrl = " https://e851-2406-da1a-aeb-7600-aa24-8812-c5fc-20b5.ngrok-free.app/predict";

      // Use the new backend URL in API calls
      const response = await axios.post(backendUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page
        },
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error uploading file:", error.response.data.error);
      notification.error({
        message: 'Erro while Predicting',
        description: error.response.data.error,
        placement: 'topRight',
        duration: 3, // Display for 3 seconds
      });
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Emotion Recognition</h1>
      <h4 className="app-title-xs">Identifiable Emotions are Angry, Happy, Neutral, Sad, Surprise</h4>

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
