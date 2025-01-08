from flask import Flask, request, jsonify
from flask_cors import CORS
from fastai.vision.all import load_learner, PILImage
import cv2
import numpy as np
from PIL import Image

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = "emotion_recognition_model.pkl"
learn = load_learner(model_path)

# Define class labels (adjust based on your dataset)
class_labels = ["Angry", "Happy", "Neutral", "Sad", "Surprise", "Ahegao"]

# Load OpenCV's pre-trained Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(f"{cv2.data.haarcascades}haarcascade_frontalface_default.xml")

def detect_and_crop_face(image):
    """Detect and crop the largest face in an image using OpenCV."""
    # Convert PIL Image to OpenCV format
    image_np = np.array(image)
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return None  # No face detected

    # Select the largest face (to handle multiple detections)
    largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
    x, y, w, h = largest_face

    # Crop the face from the image
    cropped_face = image_np[y:y+h, x:x+w]

    # Convert cropped face back to PIL Image
    return Image.fromarray(cropped_face)  # Directly return the converted image

@app.route("/predict", methods=["POST"])
def predict():
    if request.method == "OPTIONS":
        # Preflight request
        return jsonify({"message": "Preflight check successful"}), 200
    
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Load and preprocess the image
        img = PILImage.create(file)

        # Detect and crop the face
        cropped_face = detect_and_crop_face(img)
        if cropped_face is None:
            return jsonify({"error": "No human face detected in the image"}), 400

        # Predict emotion
        pred, _, probs = learn.predict(cropped_face)
        prediction_label = class_labels[int(pred)]

        response = {
            "prediction": prediction_label,
            "confidence": max(probs.tolist())  # Return the highest probability
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
