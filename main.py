import os
import tempfile
import base64
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pipeline import TrafficViolationPipeline

app = FastAPI(title="Gridlock API", description="API for Automated Traffic Violation Detection")

# Configure CORS so the React frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pipeline once when the server starts
pipeline = TrafficViolationPipeline()

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    # Save the uploaded file to a temporary location
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tfile:
            contents = await file.read()
            tfile.write(contents)
            img_path = tfile.name

        # Process the image through our pipeline
        annotated_img, report = pipeline.process(img_path)

        # Encode the annotated image as base64 to send to the frontend
        # cv2.imencode returns a tuple (success, encoded_image)
        success, encoded_image = cv2.imencode('.jpg', annotated_img)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode annotated image.")
        
        b64_img = base64.b64encode(encoded_image.tobytes()).decode('utf-8')

        return JSONResponse(content={
            "report": report,
            "annotated_image_base64": f"data:image/jpeg;base64,{b64_img}"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup the temporary file
        if 'img_path' in locals() and os.path.exists(img_path):
            os.remove(img_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
