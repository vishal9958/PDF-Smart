import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DocToPDF.css";

function DocToPDF() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.name.endsWith(".doc") || selected.name.endsWith(".docx"))) {
      setFile(selected);
    } else {
      alert("Please select a valid DOC or DOCX file.");
    }
  };

  const handleConvert = async () => {
    if (!file) return alert("Please select a file first.");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("https://pdf-backend.onrender.com/api/doc-to-pdf", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ Conversion failed:", err);
      alert("Conversion failed.");
    }
  };

  return (
    <div className="doc-pdf-wrapper">
      <h2>📄 DOC to PDF Converter</h2>

      <div className="upload-box">
        <label className="file-label">
          📁 Select DOC/DOCX File
          <input type="file" accept=".doc,.docx" onChange={handleFileChange} hidden />
        </label>

        {file && <p className="file-name">✅ Selected: {file.name}</p>}

        <button onClick={handleConvert}>🚀 Convert to PDF</button>
        <button className="back-btn" onClick={() => navigate("/")}>← Back to Dashboard</button>
      </div>
    </div>
  );
}

export default DocToPDF;
