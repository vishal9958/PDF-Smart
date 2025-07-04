import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const tools = [
  {
    name: "Image to PDF",
    path: "/image-to-pdf",
    icon: "https://img.icons8.com/fluency/96/image.png",
    class: "image-to-pdf",
  },
  {
    name: "PDF Editor",
    path: "/pdf-editor",
    icon: "https://img.icons8.com/fluency/96/edit-file.png",
    class: "pdf-editor",
  },
  {
    name: "PDF to DOC",
    path: "/pdf-to-doc",
    icon: "https://img.icons8.com/color/96/pdf-2.png",
    class: "pdf-to-doc",
  },
  {
    name: "PDF Compressor",
    path: "/pdf-compressor",
    icon: "https://img.icons8.com/fluency/96/compress.png",
    class: "pdf-compressor",
  },
  {
    name: "Resume Builder",
    path: "/resume-builder",
    icon: "https://img.icons8.com/fluency/96/resume.png",
    class: "resume-builder",
  },
  {
    name: "DOC to PDF",
    path: "/doc-to-pdf",
    icon: "https://img.icons8.com/fluency/96/ms-word.png",
    class: "doc-to-pdf",
  },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard">
      <div className="wave-container">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#667eea"
            fillOpacity="2"
            d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,106.7C672,96,768,96,864,128C960,160,1056,224,1152,229.3C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* 🧭 Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <button className="hamburger" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="logo">📄 Edits Tools</div>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links desktop-only">
          <Link to="/">Dashboard</Link>
          <Link to="/service">Services</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      {/* 📱 Mobile Sidebar */}
      <div className={`mobile-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>✖</button>
        <Link to="/" onClick={toggleSidebar}>Dashboard</Link>
        <Link to="/service" onClick={toggleSidebar}>Services</Link>
        <Link to="/about" onClick={toggleSidebar}>About</Link>
      </div>

      <div className="header-content">
        <h1>Edit Your PDF's</h1>
        <p>Select a tool to get started</p>
      </div>

      <div className="tool-grid">
        {tools.map((tool, index) => (
          <Link to={tool.path} key={index} className={`tool-card ${tool.class}`}>
            <img src={tool.icon} alt={tool.name} />
            <h3>{tool.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
