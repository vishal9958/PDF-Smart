import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PDFCompressor.css";

function PDFCompressor() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCompress = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://pdf-backend.onrender.com/api/compress", formData, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "compressed_" + file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Compression failed.");
    }
  };

  return (
    
    <div className="compressor-container">
      <h2>📄 PDF Compressor</h2>

      <label htmlFor="pdfInput" className="custom-upload-label">
        📂 Choose PDF
      </label>
      <input
        id="pdfInput"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden-file-input"
      />

      {file ? (
        <p className="file-name">Selected: {file.name}</p>
      ) : (
        <p className="file-placeholder">📁 Please select a PDF</p>
      )}

      <button onClick={handleCompress} className="compress-btn">
        Compress PDF
      </button>

      <button onClick={() => navigate("/")} className="back-button">
        ⬅️ Back to Dashboard
      </button>
    </div>
    
  );
  
}

export default PDFCompressor;
