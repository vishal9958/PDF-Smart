import React from "react";
import "./about.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-container">
      <h1>ℹ️ About Our PDF Toolkit</h1>
      <p>
        Welcome to <strong>Smart PDF Tools</strong> – your all-in-one platform for managing and converting documents efficiently. Whether you're a student, a working professional, or a business user, our tools are designed to make document handling smooth and hassle-free.
      </p>

      <h2>🚀 What We Offer</h2>
      <ul>
        <li>📸 Convert images to PDF with ease</li>
        <li>📄 Compress heavy PDFs quickly</li>
        <li>🔄 Convert PDF to Word and vice versa</li>
        <li>✏️ Merge, Split, Rotate & Watermark PDFs</li>
        <li>🧾 Create stunning resumes in minutes</li>
        <li>📃 Convert DOCX files into high-quality PDFs</li>
      </ul>

      <h2>👨‍💻 Why We Built This</h2>
      <p>
        Document tools are often spread across multiple sites and hard to use. We built this lightweight, privacy-focused PDF toolkit to bring everything into one place — fast, simple, and secure.
      </p>

      <h2>👥 Meet the Creator</h2>
      <p>
        This project is built and maintained by <strong>Vishal Biswas</strong>, a passionate web developer focused on clean UI, modern tools, and real-world problem solving.
      </p>

      <Link to="/" className="about-back-btn">⬅️ Back to Dashboard</Link>
    </div>
  );
}

export default About;
