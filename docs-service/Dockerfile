FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
      tesseract-ocr tesseract-ocr-ara tesseract-ocr-eng ocrmypdf poppler-utils ghostscript \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir 'markitdown[all]' fastapi uvicorn python-multipart
WORKDIR /app
COPY app.py .
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')"
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
