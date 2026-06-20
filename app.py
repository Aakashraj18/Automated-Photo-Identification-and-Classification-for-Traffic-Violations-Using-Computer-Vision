import streamlit as st
from streamlit_option_menu import option_menu
import cv2
import tempfile
import os
from pipeline import TrafficViolationPipeline

st.set_page_config(page_title="Gridlock: Traffic Control", layout="wide")

with st.sidebar:
    st.title("🚦 Gridlock")
    st.subheader("TRAFFIC CONTROL")
    
    selected = option_menu(
        menu_title=None,
        options=["Executive Dashboard", "AI Predictor", "Dispatch Center", "Historical Analytics", "Post-Event Learning"],
        icons=["speedometer2", "robot", "truck", "clock-history", "arrow-repeat"],
        default_index=0,
    )

@st.cache_resource
def load_pipeline():
    # Load model once to avoid reloading on every interaction
    return TrafficViolationPipeline()

pipeline = load_pipeline()

if selected == "Executive Dashboard":
    st.title("Automated Traffic Violation Detection")
    st.write("Upload a traffic image to detect violations and extract evidence.")

    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        # Save uploaded file temporarily for OpenCV processing
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tfile:
            tfile.write(uploaded_file.getbuffer())
            img_path = tfile.name
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Original Image")
            st.image(img_path, use_container_width=True)
            
        with st.spinner('Analyzing image for violations...'):
            try:
                evidence_img, report = pipeline.process(img_path)
                
                # Convert BGR (OpenCV) to RGB (Streamlit)
                evidence_img_rgb = cv2.cvtColor(evidence_img, cv2.COLOR_BGR2RGB)
                
                with col2:
                    st.subheader("Annotated Evidence")
                    st.image(evidence_img_rgb, use_container_width=True)
                    
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
                    
            except Exception as e:
                st.error(f"Error processing image: {str(e)}")
            finally:
                # Cleanup temporary file
                if os.path.exists(img_path):
                    os.remove(img_path)
else:
    st.title(selected)
    st.info(f"The {selected} module is currently under construction for this prototype.")
