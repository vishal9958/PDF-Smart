import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import ImageToPDF from "./tools/ImageToPDF";
import PDFCompressor from "./tools/PDFCompressor";
import PDFtoDOC from "./tools/PDFtoDOC";
import PDFEditor from "./tools/PDFEditor";
import ResumeBuilder from "./tools/resumeBuilder";
import DocToPDF from "./tools/DocToPDF";
import About from "./components/About";
import Service from "./components/service";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/image-to-pdf" element={<ImageToPDF />} />
        <Route path="/pdf-compressor" element={<PDFCompressor />} />
        <Route path="/pdf-to-doc" element={<PDFtoDOC />} />
        <Route path="/pdf-editor" element={<PDFEditor />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/doc-to-pdf" element={<DocToPDF />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
      </Routes>
    </Router>
  );
}

export default App;
