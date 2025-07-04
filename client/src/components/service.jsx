import React from "react";
import "./service.css";
import { Link } from "react-router-dom";

function Service() {
  const services = [
    {
      name: "Image to PDF",
      path: "/image-to-pdf",
      icon: "🖼️",
      desc: "Convert your images (JPG/PNG) into a single PDF document.",
    },
    {
      name: "PDF Compressor",
      path: "/pdf-compressor",
      icon: "📉",
      desc: "Reduce the file size of your PDF without losing quality.",
    },
    {
      name: "PDF to DOCX",
      path: "/pdf-to-doc",
      icon: "📄➡️📝",
      desc: "Convert PDF files to editable Microsoft Word documents.",
    },
    {
      name: "PDF Editor",
      path: "/pdf-editor",
      icon: "✏️",
      desc: "Rotate, merge, split, and watermark your PDF files easily.",
    },
    {
      name: "Resume Builder",
      path: "/resume-builder",
      icon: "👨‍💼",
      desc: "Create professional resumes and download them in PDF format.",
    },
    {
      name: "DOCX to PDF",
      path: "/doc-to-pdf",
      icon: "📃➡️📄",
      desc: "Convert your Word documents (.docx) into PDF instantly.",
    },
  ];

  return (
    <div className="services-container">
      <h2>🛠️ Our PDF Services</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <Link to={service.path} key={index} className="service-card">
            <div className="icon">{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.desc}</p>
          </Link>
        ))}
      </div>
      <Link to="/" className="back-btn">⬅️ Back to Dashboard</Link>
    </div>
  );
}

export default Service;
