from flask import Flask, request, jsonify
from flask_cors import CORS
from fastai.vision.all import load_learner, PILImage

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = "emotion_recognition_model.pkl"
learn = load_learner(model_path)

# Define class labels (adjust based on your dataset)
class_labels = ["Angry", "Happy", "Neutral", "Sad", "Surprise", "Ahegao"]

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Load and preprocess the image
        img = PILImage.create(file)
        pred, _, probs = learn.predict(img)

        # Map prediction index to human-readable label
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
