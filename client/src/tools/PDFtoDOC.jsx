import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PDFtoDOC.css";

function PDFtoDOC() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      const res = await axios.post("https://pdf-backend.onrender.com/api/pdf-to-doc", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name.replace(".pdf", ".docx"));
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-doc-container">
      <h2 className="title">PDF to DOC Converter</h2>

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

      <button onClick={handleConvert} disabled={loading} className="convert-button">
        {loading ? "Converting..." : "Convert to DOC"}
      </button>

      <button onClick={() => navigate("/")} className="back-button">
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}

export default PDFtoDOC;
