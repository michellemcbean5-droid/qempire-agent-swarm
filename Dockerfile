FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# System dependencies
RUN apt-get update && apt-get install -y \
    python3.11 python3-pip python3.11-venv \
    nodejs npm \
    git curl wget jq \
    && rm -rf /var/lib/apt/lists/*

# Python environment
WORKDIR /app
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Install Playwright browsers
RUN playwright install chromium --with-deps

# Create workspace directories
RUN mkdir -p /home/ubuntu/workspace /home/ubuntu/output/websites /home/ubuntu/output/documents

# Copy application code
COPY . /app/

# Default command: run the bridge monitor
CMD ["python3", "bridge/monitor.py"]
