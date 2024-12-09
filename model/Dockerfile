# Model/Dockerfile
FROM python:3.10-slim

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install\
    libgl1\
    libgl1-mesa-glx \ 
    libglib2.0-0 -y && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "src/panorama_model.py"]
