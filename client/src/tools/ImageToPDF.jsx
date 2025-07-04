import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import "./ImageToPDF.css";

function ImageToPDF() {
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
    setPdfUrl(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) return alert("Please upload image files!");
    setLoading(true);
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      const response = await axios.post("https://pdf-backend.onrender.com/api/image-to-pdf", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      setPdfBlob(blob);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error:", error);
      alert("Error converting images!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-pdf-container">
      <div className="wave-container">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#667eea" fillOpacity="1"
            d="M0,128L60,138.7C120,149,240,171,360,186.7C480,203,600,213,720,197.3C840,181,960,139,1080,112C1200,85,1320,75,1380,69.3L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>

      <div className="back-button" onClick={() => navigate("/")}>⬅ Back to Dashboard</div>

      <div className="header-content">
        <h1>🖼️ Convert Images to PDF</h1>
        <p>Select your images below and generate a PDF file instantly!</p>
      </div>

      <div className="pdf-wrapper">
        <div className="upload-box">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            id="file-input"
          />
          <label htmlFor="file-input">📁 Choose Images</label>
        </div>

        {images.length > 0 && (
          <div className="image-preview-container">
            {images.map((img, index) => (
              <div className="image-card" key={index}>
                <img src={URL.createObjectURL(img)} alt={`img-${index}`} />
                <button
                  className="delete-btn"
                  onClick={() => {
                    const newImages = [...images];
                    newImages.splice(index, 1);
                    setImages(newImages);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleConvert} disabled={loading}>
          {loading ? "Converting..." : "Convert to PDF"}
        </button>

        {pdfUrl && (
          <div className="download-box">
            <button onClick={() => {
              const fileName = prompt("Enter file name:", "Converted.pdf");
              if (fileName) {
                saveAs(pdfBlob, fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
              }
            }}>
              💾 Save PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageToPDF;
