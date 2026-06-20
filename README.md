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

Total Violations Detected", value=len(report['violations']))
        st.write("Recent Violations Log:")
        st.dataframe([v for v in report['violations']])
    else:
        st.success("No violations detected in this image.")
        
    # Cleanup temporary file
    os.remove(img_path)
```