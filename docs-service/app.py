"""Nyxom docs service: any document -> Markdown, with Arabic+English OCR fallback.
POST /convert  (multipart 'file', header 'X-API-Key')  -> {"markdown", "method", "pages", "ocr_pages"}
"""
import os, re, subprocess, tempfile
from fastapi import FastAPI, File, Header, HTTPException, UploadFile

API_KEY = os.environ.get("DOCS_API_KEY", "")
LANGS = os.environ.get("OCR_LANGS", "ara+eng")
BIDI = re.compile("[‎‏‪-‮⁦-⁩]")
app = FastAPI(title="nyxom-docs")

def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, timeout=600, **kw)

def pdf_pages(path):
    r = run(["pdfinfo", path]); m = re.search(rb"Pages:\s+(\d+)", r.stdout)
    return int(m.group(1)) if m else 0

def pdf_page_text(path, n):
    r = run(["pdftotext", "-layout", "-enc", "UTF-8", "-f", str(n), "-l", str(n), path, "-"])
    t = BIDI.sub("", r.stdout.decode("utf-8", "ignore"))
    return "\n".join(l.strip() for l in t.splitlines() if l.strip())

def convert_pdf(path):
    n = pdf_pages(path)
    texts = [pdf_page_text(path, i) for i in range(1, n + 1)]
    weak = [i + 1 for i, t in enumerate(texts) if len(t) < 25]
    method = "text"
    if weak:  # OCR only the image-only pages, keep existing text layers
        out = path + ".ocr.pdf"
        r = run(["ocrmypdf", "--skip-text", "-l", LANGS, "--pages", ",".join(map(str, weak)),
                 "--output-type", "pdf", "--quiet", path, out])
        if r.returncode == 0:
            for p in weak: texts[p - 1] = pdf_page_text(out, p)
            method = "text+ocr"
    still = [i + 1 for i, t in enumerate(texts) if len(t) < 25]
    md = "".join(f"\n\n## Page {i+1}\n\n{t}" for i, t in enumerate(texts))
    return md, method, n, weak, still

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/convert")
async def convert(file: UploadFile = File(...), x_api_key: str = Header(default="")):
    if not API_KEY or x_api_key != API_KEY:
        raise HTTPException(401, "invalid api key")
    suffix = os.path.splitext(file.filename or "")[1].lower()
    with tempfile.TemporaryDirectory() as d:
        path = os.path.join(d, "in" + suffix)
        with open(path, "wb") as f: f.write(await file.read())
        if suffix == ".pdf":
            md, method, n, ocr_pages, unreadable = convert_pdf(path)
            return {"markdown": md, "method": method, "pages": n,
                    "ocr_pages": ocr_pages, "unreadable_pages": unreadable}
        if suffix in (".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp", ".bmp"):
            r = run(["tesseract", path, "-", "-l", LANGS])
            return {"markdown": r.stdout.decode("utf-8", "ignore"), "method": "ocr"}
        from markitdown import MarkItDown
        return {"markdown": MarkItDown().convert(path).text_content, "method": "markitdown"}
