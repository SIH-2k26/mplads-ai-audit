FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1     PYTHONDONTWRITEBYTECODE=1     PIP_NO_CACHE_DIR=1     PYTHONPATH=/app:/app/backend

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends     build-essential     libpq-dev     curl     && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip &&     pip install -r /app/requirements.txt

COPY backend /app/backend
COPY data /app/data
COPY configs /app/configs
COPY regulatory /app/regulatory
COPY scripts /app/scripts

EXPOSE 8000

CMD sh -c "cd /app/backend && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
