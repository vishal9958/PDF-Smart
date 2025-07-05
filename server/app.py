from flask import Flask, request, send_file
from flask_cors import CORS
import os, io, zipfile
import img2pdf
from PyPDF2 import PdfReader, PdfWriter
from pdf2docx import Converter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import requests

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "✅ PDF Smart Backend is Running Successfully!"


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 1️⃣ Image to PDF
@app.route("/convert", methods=["POST"])
def convert_to_pdf():
    try:
        image_files = request.files.getlist("images")
        image_paths = []

        for img in image_files:
            if img.filename.lower().endswith((".png", ".jpg", ".jpeg")):
                path = os.path.join(UPLOAD_FOLDER, img.filename)
                img.save(path)
                image_paths.append(path)

        if not image_paths:
            return "No valid image files", 400

        output_pdf = os.path.join(UPLOAD_FOLDER, "output.pdf")
        with open(output_pdf, "wb") as f:
            f.write(img2pdf.convert(image_paths))

        return send_file(output_pdf, as_attachment=True)

    except Exception as e:
        print("🔥 Error in /convert:", str(e))
        return "Image to PDF conversion failed", 500

# 2️⃣ PDF to DOCX
@app.route("/api/pdf-to-doc", methods=["POST"])
def pdf_to_doc():
    try:
        pdf_file = request.files['pdf']
        input_path = os.path.join(UPLOAD_FOLDER, pdf_file.filename)
        pdf_file.save(input_path)

        output_path = os.path.join(UPLOAD_FOLDER, pdf_file.filename.replace(".pdf", ".docx"))

        cv = Converter(input_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print("🔥 Error in /api/pdf-to-doc:", str(e))
        return "PDF to DOCX conversion failed", 500

# 3️⃣ Compress PDF
@app.route("/api/compress", methods=["POST"])
def compress_pdf():
    try:
        file = request.files['file']
        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(input_path)

        reader = PdfReader(input_path)
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        output_path = os.path.join(UPLOAD_FOLDER, "compressed_" + file.filename)
        with open(output_path, "wb") as f:
            writer.write(f)

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print("🔥 Error in /api/compress:", str(e))
        return "Compression failed", 500

# 4️⃣ Rotate PDF
@app.route("/api/rotate", methods=["POST"])
def rotate_pdf():
    try:
        file = request.files['file']
        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(input_path)

        reader = PdfReader(input_path)
        writer = PdfWriter()
        for page in reader.pages:
            page.rotate(90)
            writer.add_page(page)

        output_path = os.path.join(UPLOAD_FOLDER, "rotated_" + file.filename)
        with open(output_path, "wb") as f:
            writer.write(f)

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print("🔥 Error in /api/rotate:", str(e))
        return "PDF rotation failed", 500

# 5️⃣ Merge PDFs
@app.route("/api/merge", methods=["POST"])
def merge_pdfs():
    try:
        files = request.files.getlist("files")
        writer = PdfWriter()

        for file in files:
            reader = PdfReader(file)
            for page in reader.pages:
                writer.add_page(page)

        output_path = os.path.join(UPLOAD_FOLDER, "merged.pdf")
        with open(output_path, "wb") as f:
            writer.write(f)

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print("🔥 Error in /api/merge:", str(e))
        return "Merging failed", 500

# 6️⃣ Split PDF
@app.route("/api/split", methods=["POST"])
def split_pdf():
    try:
        file = request.files['file']
        reader = PdfReader(file)

        zip_io = io.BytesIO()
        with zipfile.ZipFile(zip_io, 'w') as zipf:
            for i, page in enumerate(reader.pages):
                writer = PdfWriter()
                writer.add_page(page)

                page_io = io.BytesIO()
                writer.write(page_io)
                zipf.writestr(f"page_{i+1}.pdf", page_io.getvalue())

        zip_io.seek(0)
        return send_file(zip_io, as_attachment=True, download_name="split_pages.zip", mimetype="application/zip")

    except Exception as e:
        print("🔥 Error in /api/split:", str(e))
        return "Splitting failed", 500

# 7️⃣ Watermark
@app.route("/api/watermark", methods=["POST"])
def add_watermark():
    try:
        file = request.files['file']
        watermark_text = request.form.get("watermark", "Confidential")

        reader = PdfReader(file)
        writer = PdfWriter()

        watermark_pdf = io.BytesIO()
        c = canvas.Canvas(watermark_pdf, pagesize=letter)
        c.setFont("Helvetica-Bold", 40)
        c.setFillColorRGB(0.7, 0.7, 0.7)
        c.drawCentredString(300, 500, watermark_text)
        c.save()

        watermark_pdf.seek(0)
        watermark_reader = PdfReader(watermark_pdf)
        watermark_page = watermark_reader.pages[0]

        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)

        output = io.BytesIO()
        writer.write(output)
        output.seek(0)

        return send_file(output, as_attachment=True, download_name="watermarked.pdf")

    except Exception as e:
        print("🔥 Error in /api/watermark:", str(e))
        return "Watermarking failed", 500

# 8️⃣ Resume Builder PDF Generator
@app.route("/api/download-resume", methods=["POST"])
def download_resume():
    try:
        data = request.json  # Frontend will send JSON

        name = data.get("name", "Unnamed")
        email = data.get("email", "")
        phone = data.get("phone", "")
        summary = data.get("summary", "")
        education = data.get("education", [])
        experience = data.get("experience", [])

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        y = 750

        # Header
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, y, name)
        y -= 20
        c.setFont("Helvetica", 12)
        c.drawString(50, y, f"Email: {email} | Phone: {phone}")
        y -= 30

        # Summary
        c.setFont("Helvetica-Bold", 13)
        c.drawString(50, y, "Professional Summary:")
        y -= 20
        c.setFont("Helvetica", 11)
        for line in summary.split('\n'):
            c.drawString(60, y, line)
            y -= 15
        y -= 10

        # Education
        c.setFont("Helvetica-Bold", 13)
        c.drawString(50, y, "Education:")
        y -= 20
        c.setFont("Helvetica", 11)
        for edu in education:
            for line in edu.split('\n'):
                c.drawString(60, y, line)
                y -= 15
            y -= 5

        # Experience
        c.setFont("Helvetica-Bold", 13)
        c.drawString(50, y, "Experience:")
        y -= 20
        c.setFont("Helvetica", 11)
        for exp in experience:
            for line in exp.split('\n'):
                c.drawString(60, y, line)
                y -= 15
            y -= 5

        c.save()
        buffer.seek(0)

        return send_file(buffer, as_attachment=True, download_name="resume.pdf", mimetype="application/pdf")

    except Exception as e:
        print("🔥 Error in /api/download-resume:", e)
        return "Resume generation failed", 500
    
    # 9️⃣ DOC to PDF
@app.route("/api/doc-to-pdf", methods=["POST"])
def doc_to_pdf():
    try:
        file = request.files["file"]
        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(input_path)

        # Upload to CloudConvert
        api_key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjExYzYwMmYzNzk2NzNlMzA4MmY4NzdjNDUyMzhmODljZGJlM2VjMmMwNjY4MTliYzQ4ZTFhMzEzNjYwODE2ZWUwNDFlMDBlMjMxNjQzYzIiLCJpYXQiOjE3NTE3NDQ4OTIuMzIzNjY4LCJuYmYiOjE3NTE3NDQ4OTIuMzIzNjY5LCJleHAiOjQ5MDc0MTg0OTIuMzE3ODE0LCJzdWIiOiI3MjM2Nzc4NiIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.YCUnGkC-nZ2OetZIUCnMbIbAvCjuMEJl5Ec-Cy5798u4aZ-LrpnMkCJTZt8jb6ahpB_EP1Wm3kGYkn456Y_z9hOavu9LQpcWs7ptEEAZtX9A79wVX_ValcaSq4p4CEDRNP2Z1ru1pZyXnYU8ZIy4pXWSaG57cqkCZP3n-T4vxpeRnM1JkFMAv5HdcPzRTfp8qfCFrqDuIFU0uiqL2XsLA3ALOYBGChqV6LSpIzotEn1pX2Kc8Sg6SMpqQd8yM1YZ35x5CuAYhwusy5pF2xAttC6Xu1bwa6XwxbhEy_vPhFElkkzez1DMBHwPfgs3iNQVho8OX-WOjrIYEB7JW5iZOJ3zZlVT-b2QQypmF4ipR3es6su8JB-742elOTLBgzdmL7mn7IxXOxkmRQvaoC15gi_1oGIu6xbK3Rd2EjGsrMpOWphT843TvSwYJnCXJqu3TOCm_a_LYehuX1L_WpdanXBQHtgcE9gOu98ROQCRcF0sskdvxbrL-vfeJLSOEVLaWN_nMrO45TZhHbwBk53nTKrQg_W23TpdQoTLR89Cv5sSw45nqRCUkg4a76R4mXnPaR-iQkaqsTxix1UL-EnFvcV26cmV1fe7DMsi6oqU2q7Hr2aWf30q_WV-0_hE_t7JPReHnacMaft97CdDeo97jb5W_DbFovsDeHeyCIMYiqM"  # 👈 Replace with your CloudConvert API key
        convert_url = "https://api.cloudconvert.com/v2/convert"

        files = {'file': open(input_path, 'rb')}
        data = {
            "apikey": api_key,
            "inputformat": "docx",
            "outputformat": "pdf",
        }

        response = requests.post("https://api.cloudconvert.com/v2/convert", data=data, files=files)
        result = response.json()

        # ⚠️ You'll need to handle download link here (or use their official SDK)

        return "Converted (mock)", 200  # Placeholder

    except Exception as e:
        print("🔥 Error in /api/doc-to-pdf:", str(e))
        return "DOC to PDF conversion failed", 500
    
# ✅ Start the server
if __name__ == "__main__":
    app.run(debug=True)
