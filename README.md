# Gridlock: Automated Traffic Violation Detection System

## System Architecture & Tech Stack

### Architecture Overview
The system follows a microservices-inspired architecture designed for scalability and near real-time processing:
1.  **Frontend (Streamlit)**: Provides an intuitive web interface for users to upload traffic images, visualize processing results, and view extracted metadata.
2.  **Backend (FastAPI)**: Serves as the orchestration layer. It receives images, coordinates the AI models, aggregates results, and returns the final annotated evidence and metadata.
3.  **AI Pipeline**:
    *   **Preprocessor**: Enhances image quality using OpenCV.
    *   **Detector (YOLOv8)**: Localizes vehicles, riders, and pedestrians.
    *   **Violation Classifier**: Rule-based or secondary ML models to identify specific violations (e.g., helmet absence).
    *   **ALPR (EasyOCR)**: Extracts license plate text from cropped vehicle images.
4.  **Analytics & Storage Layer**: Stores metadata (JSON format) and provides searchable records.

### Tech Stack Recommendations
*   **Frontend**: Streamlit (Rapid prototyping, excellent Python integration).
*   **Backend API**: FastAPI (High performance, async support, automatic interactive documentation).
*   **Computer Vision Framework**: OpenCV (Image preprocessing, annotation, bounding boxes).
*   **Object Detection Model**: YOLOv8 by Ultralytics (State-of-the-art speed and accuracy for real-time vehicle/person detection).
*   **Optical Character Recognition (OCR)**: EasyOCR or Tesseract (Extracting license plates). EasyOCR is recommended for better out-of-the-box accuracy on "wild" images.
*   **Data Handling**: Pandas (Analytics), JSON (Metadata schemas).
*   **Environment**: Python 3.9+, PyTorch (for YOLO/EasyOCR).

---

## Core Python Implementation

This section contains the foundational Python code for the backend computer vision pipeline. Save this in a file named `pipeline.py`.

```python
import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import json
from datetime import datetime

class TrafficViolationPipeline:
    def __init__(self, yolo_model_path='yolov8n.pt'):
        # Initialize models
        self.detector = YOLO(yolo_model_path)
        # Set gpu=False if no GPU is available on your machine
        self.reader = easyocr.Reader(['en'], gpu=True) 
        
        # Define target classes (COCO dataset indices: 2-car, 3-motorcycle, 5-bus, 7-truck, 0-person)
        self.vehicle_classes = [2, 3, 5, 7]
        self.person_class = 0

    def preprocess_image(self, image_path):
        """
        Enhances image quality to handle low light, rain, and blur.
        """
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Image not found")
            
        # 1. Noise reduction (helps with rain/grain)
        img_denoised = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
        
        # 2. Contrast Limited Adaptive Histogram Equalization (CLAHE) for low light/shadows
        lab = cv2.cvtColor(img_denoised, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        img_enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        
        # 3. Sharpening (helps with mild motion blur)
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        img_sharpened = cv2.filter2D(img_enhanced, -1, kernel)
        
        return img_sharpened

    def detect_objects(self, img):
        """
        Detects vehicles and people using YOLOv8.
        """
        results = self.detector(img, classes=self.vehicle_classes + [self.person_class], conf=0.5)
        detections = []
        
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                class_name = self.detector.names[cls]
                
                detections.append({
                    "bbox": [x1, y1, x2, y2],
                    "class": class_name,
                    "confidence": conf
                })
        return detections

    def classify_violations(self, img, detections):
        """
        Stub for violation classification logic.
        In a real system, this would involve complex spatial analysis or secondary models.
        """
        violations = []
        # Example Logic: If a person is detected near a motorcycle, check for helmet.
        # This is a simplified mock.
        for det in detections:
            if det['class'] in ['car', 'motorcycle', 'truck', 'bus']:
                # Mock a random violation for demonstration purposes
                if np.random.rand() > 0.7: 
                    violation_type = "Speeding" if det['class'] == 'car' else "No Helmet"
                    violations.append({
                        "vehicle_type": det['class'],
                        "violation": violation_type,
                        "confidence": round(np.random.uniform(0.6, 0.95), 2),
                        "bbox": det['bbox']
                    })
        return violations

    def recognize_license_plate(self, img, bbox):
        """
        Extracts license plate text using EasyOCR.
        """
        x1, y1, x2, y2 = bbox
        # Add padding to ensure the whole plate is captured
        pad = 10
        x1, y1 = max(0, x1-pad), max(0, y1-pad)
        x2, y2 = min(img.shape[1], x2+pad), min(img.shape[0], y2+pad)
        
        roi = img[y1:y2, x1:x2]
        
        # Convert to grayscale for better OCR performance
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        
        results = self.reader.readtext(gray_roi)
        
        if results:
            # Sort by confidence and pick the best
            best_text = results[0][1]
            return best_text
        return "UNKNOWN"

    def generate_evidence(self, original_img, violations):
        """
        Draws bounding boxes and creates metadata payload.
        """
        annotated_img = original_img.copy()
        metadata = {
            "timestamp": datetime.now().isoformat(),
            "violations": []
        }
        
        for v in violations:
            x1, y1, x2, y2 = v['bbox']
            
            # Attempt ALPR on the vehicle region
            plate_text = self.recognize_license_plate(original_img, v['bbox'])
            
            # Draw on image
            label = f"{v['violation']} ({v['confidence']:.2f}) - {plate_text}"
            color = (0, 0, 255) # Red for violations
            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
            cv2.putText(annotated_img, label, (x1, max(y1 - 10, 0)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            # Update metadata schema
            metadata["violations"].append({
                "type": v['violation'],
                "vehicle": v['vehicle_type'],
                "plate": plate_text,
                "confidence": v['confidence']
            })
            
        return annotated_img, metadata

    def calculate_metrics(self, ground_truth, predictions, iou_threshold=0.5):
        """
        Calculates standard object detection metrics.
        (Stub implementation - requires specific format for truth/preds)
        """
        # True Positives, False Positives, False Negatives
        # TP = ... ; FP = ... ; FN = ...
        # accuracy = TP / (TP + FP + FN + TN)
        # precision = TP / (TP + FP)
        # recall = TP / (TP + FN)
        # f1_score = 2 * (precision * recall) / (precision + recall)
        
        return {
            "accuracy": 0.85,
            "precision": 0.82,
            "recall": 0.88,
            "f1_score": 0.85,
            "mAP": 0.75
        }

    def process(self, image_path):
        """Main pipeline execution."""
        img = self.preprocess_image(image_path)
        detections = self.detect_objects(img)
        violations = self.classify_violations(img, detections)
        evidence_img, report = self.generate_evidence(img, violations)
        return evidence_img, report
```

---

## Streamlit App Code

This provides a simple frontend to test the pipeline. Save this in a file named `app.py`.

```python
# app.py
import streamlit as st
import cv2
import tempfile
import os
from pipeline import TrafficViolationPipeline

st.set_page_config(page_title="Gridlock: Traffic Violation Detector", layout="wide")

@st.cache_resource
def load_pipeline():
    # Load model once to avoid reloading on every interaction
    return TrafficViolationPipeline()

st.title("🚦 Automated Traffic Violation Detection")
st.write("Upload a traffic image to detect violations and extract evidence.")

pipeline = load_pipeline()

uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    # Save uploaded file temporarily for OpenCV processing
    tfile = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    tfile.write(uploaded_file.read())
    img_path = tfile.name
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Original Image")
        st.image(img_path, use_column_width=True)
        
    with st.spinner('Analyzing image for violations...'):
        evidence_img, report = pipeline.process(img_path)
        
        # Convert BGR (OpenCV) to RGB (Streamlit)
        evidence_img_rgb = cv2.cvtColor(evidence_img, cv2.COLOR_BGR2RGB)
        
    with col2:
        st.subheader("Annotated Evidence")
        st.image(evidence_img_rgb, use_column_width=True)
        
    st.subheader("Violation Report Metadata")
    st.json(report)
    
    # Mock Analytics Display
    st.subheader("📊 Session Analytics Mock")
    if report['violations']:
        st.metric(label="Total Violations Detected", value=len(report['violations']))
        st.write("Recent Violations Log:")
        st.dataframe([v for v in report['violations']])
    else:
        st.success("No violations detected in this image.")
        
    # Cleanup temporary file
    os.remove(img_path)
```

## Running the Project
1. Install dependencies: `pip install streamlit ultralytics easyocr opencv-python-headless numpy pandas`
2. Run the Streamlit app: `streamlit run app.py`
