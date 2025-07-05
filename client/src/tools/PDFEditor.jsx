import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PDFEditor.css";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

function PDFEditor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [mergeFiles, setMergeFiles] = useState([]);
  const [watermarkText, setWatermarkText] = useState("");
  const navigate = useNavigate();

  // Upload main PDF
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  // Collect multiple PDFs for Merge
  const handleMergeChange = (e) => {
    setMergeFiles(Array.from(e.target.files).filter(f => f.type === "application/pdf"));
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Rotate
  const handleRotate = async () => {
    if (!pdfFile) return alert("Please choose a PDF");
    const form = new FormData();
    form.append("file", pdfFile);
    const res = await axios.post("https://pdf-backend-gzkk.onrender.com/api/rotate", form, { responseType: "blob" });
    downloadBlob(new Blob([res.data], { type: "application/pdf" }), "rotated.pdf");
  };

  // Merge
  const handleMerge = async () => {
    if (mergeFiles.length < 2) return alert("Select at least 2 PDFs to merge");
    const form = new FormData();
    mergeFiles.forEach((f) => form.append("files", f));
    const res = await axios.post("https://pdf-backend-gzkk.onrender.com/api/merge", form, { responseType: "blob" });
    downloadBlob(new Blob([res.data], { type: "application/pdf" }), "merged.pdf");
  };

  // Split (enter page range)
  const handleSplit = async () => {
    if (!pdfFile) return alert("Select a PDF first");
    const range = prompt("Enter page range (e.g., 1-3):");
    if (!range || !range.match(/^\d+-\d+$/)) return alert("Invalid range");
    const [start, end] = range.split("-").map(Number);
    const form = new FormData();
    form.append("file", pdfFile);
    form.append("start", start);
    form.append("end", end);
    const res = await axios.post("https://pdf-backend-gzkk.onrender.com/api/split", form, { responseType: "blob" });
    downloadBlob(new Blob([res.data], { type: "application/pdf" }), "split.pdf");
  };

  // Watermark
  const handleWatermark = async () => {
    if (!pdfFile) return alert("Select a PDF first");
    const text = prompt("Enter watermark text:", watermarkText);
    if (!text) return;
    setWatermarkText(text);
    const form = new FormData();
    form.append("file", pdfFile);
    form.append("text", text);
    const res = await axios.post("https://pdf-backend-gzkk.onrender.com/api/watermark", form, { responseType: "blob" });
    downloadBlob(new Blob([res.data], { type: "application/pdf" }), "watermarked.pdf");
  };

  useEffect(() => () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  return (
    <div className="pdf-editor-container">
      <h2>📝 PDF Editor</h2>

      <div className="upload-section">
        <label className="file-label">
          📁 Choose PDF
          <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
        </label>
        <label className="merge-label">
          📂 Merge PDFs
          <input type="file" accept="application/pdf" multiple onChange={handleMergeChange} hidden />
        </label>
      </div>

      {!fileUrl && <p className="select-msg">📂 Please select a PDF file</p>}

      {fileUrl && (
        <div className="pdf-preview">
          <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from({ length: numPages }, (_, i) => (
              <Page key={i} pageNumber={i + 1} />
            ))}
          </Document>
        </div>
      )}

      <div className="editor-actions">
        <button onClick={handleRotate}>🔁 Rotate</button>
        <button onClick={handleMerge}>🔧 Merge</button>
        <button onClick={handleSplit}>✂️ Split</button>
        <button onClick={handleWatermark}>💧 Watermark</button>
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default PDFEditor;
