import React, { useState } from "react";
import axios from "axios";
import "./resumeBuilder.css";

function ResumeBuilder() {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    education: [""],
    experience: [""],
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleArrayChange = (e, index, field) => {
    const updated = [...formData[field]];
    updated[index] = e.target.value;
    setFormData({ ...formData, [field]: updated });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleDownload = async () => {
    try {
      const res = await axios.post(
        "https://pdf-backend.onrender.com/api/download-resume",
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          summary: formData.summary,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="resume-builder-wrapper">
      <div className="resume-form-section">
        <h2>🧾 Resume Builder</h2>
        <form className="resume-form">
          <h4>👤 Personal Info</h4>
          <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />

          <label className="upload-photo-label">
            📸 Upload Photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
          </label>

          <h4>📝 Summary</h4>
          <textarea name="summary" placeholder="Short Summary" value={formData.summary} onChange={handleChange} />

          <h4>🎓 Education</h4>
          {formData.education.map((edu, index) => (
            <textarea
              key={index}
              placeholder={`Education #${index + 1}`}
              value={edu}
              onChange={(e) => handleArrayChange(e, index, "education")}
            />
          ))}
          <button type="button" className="add-btn" onClick={() => addField("education")}>➕ Add More Education</button>

          <h4>💼 Experience</h4>
          {formData.experience.map((exp, index) => (
            <textarea
              key={index}
              placeholder={`Experience #${index + 1}`}
              value={exp}
              onChange={(e) => handleArrayChange(e, index, "experience")}
            />
          ))}
          <button type="button" className="add-btn" onClick={() => addField("experience")}>➕ Add More Experience</button>

          <h4>🧠 Skills</h4>
          <textarea name="skills" placeholder="E.g. HTML, CSS, React" value={formData.skills} onChange={handleChange} />

          <button type="button" onClick={handleDownload}>⬇️ Download Resume</button>
        </form>
        
      </div>

      <div className="resume-preview-section">
        <h3>📄 Live Preview</h3>
        <div className="resume-preview">
          {photo && <img src={photo} alt="Preview" className="photo-preview" />}
          <h2>{formData.fullName}</h2>
          <p>{formData.email} | {formData.phone} | {formData.address}</p>
          <hr />
          <h3>Summary</h3>
          <p>{formData.summary}</p>
          <h3>Education</h3>
          {formData.education.map((edu, idx) => <p key={idx}>• {edu}</p>)}
          <h3>Experience</h3>
          {formData.experience.map((exp, idx) => <p key={idx}>• {exp}</p>)}
          <h3>Skills</h3>
          <p>{formData.skills}</p>
        </div>
      </div>
      
    </div>
    
  );
}

export default ResumeBuilder;
