# Dockerfile
FROM pytorch/pytorch:2.3.0-cuda11.8-cudnn8-runtime
ENV DEBIAN_FRONTEND=noninteractive PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 git && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN pip install --no-cache-dir opencv-python scikit-learn pytest pytorch-wavelets wandb tensorboard
COPY . /app
CMD ["pytest", "-v", "test_steg_pipeline.py"]
