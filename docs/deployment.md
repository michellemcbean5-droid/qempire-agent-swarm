# Deployment Guide

This guide covers deploying the Q-Empire Agent Swarm to production.

## Deployment Options

### Option 1: Docker Compose (Recommended for Self-Hosting)

The included `docker-compose.yml` defines two services:

| Service | Role | Default Port | Command |
|---------|------|------------|---------|
| `agent` | Background task monitor | — | `python bridge/monitor.py` |
| `webhook` | HTTP API receiver | `8080` | `python bridge/webhook_receiver.py` |

#### Steps

1. **Provision a server** (Ubuntu 24.04 recommended, 2GB+ RAM)
2. **Install Docker and Docker Compose**:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose-plugin
   sudo usermod -aG docker $USER
   ```
3. **Clone the repo** and configure `.env`
4. **Run the stack**:
   ```bash
   docker compose up --build -d
   ```
5. **Verify**:
   ```bash
   curl http://localhost:8080/
   ```

#### Updating

```bash
git pull
docker compose up --build -d
```

### Option 2: Cloud Provider (AWS / GCP / Azure)

#### AWS EC2 + Docker

1. Launch an Ubuntu 24.04 t3.medium instance
2. Open ports 22 (SSH) and 8080 (webhook)
3. Install Docker as above
4. Optionally use an Elastic IP for stable DNS
5. Set up a reverse proxy (Nginx/Caddy) for HTTPS:
   ```
   https://api.yourdomain.com → localhost:8080
   ```

#### Google Cloud Run (Serverless)

Not recommended for the `agent` service because it requires a long-running polling loop. However, the `webhook` service can run on Cloud Run:

```bash
gcloud run deploy qempire-webhook \
  --source . \
  --port 8080 \
  --set-env-vars "ANTHROPIC_API_KEY=...,GITHUB_TOKEN=..."
```

Keep the `agent` monitor running on a VM or use Cloud Run Jobs for periodic execution.

### Option 3: Kubernetes

Create a `Deployment` and `Service` for each component:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qempire-agent
spec:
  replicas: 1
  selector:
    matchLabels:
      app: qempire-agent
  template:
    metadata:
      labels:
        app: qempire-agent
    spec:
      containers:
        - name: agent
          image: qempire-agent-swarm:latest
          envFrom:
            - secretRef:
                name: qempire-secrets
          volumeMounts:
            - name: memory
              mountPath: /app/memory
      volumes:
        - name: memory
          persistentVolumeClaim:
            claimName: qempire-memory
---
apiVersion: v1
kind: Service
metadata:
  name: qempire-webhook
spec:
  selector:
    app: qempire-webhook
  ports:
    - port: 8080
      targetPort: 8080
```

## Environment Security

- **Never commit `.env` or `credentials.json`** — they are in `.gitignore`
- Use a secrets manager (AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault)
- Rotate `GITHUB_TOKEN` and `ANTHROPIC_API_KEY` regularly
- Use `WEBHOOK_SECRET` to validate incoming webhooks if integrating with n8n or Zapier

## Frontend Deployment

The frontend is a static Vite build. Deploy to any static host:

```bash
cd frontend
npm run build
# Upload `dist/` to:
# - Vercel / Netlify
# - GitHub Pages
# - AWS S3 + CloudFront
# - Google Firebase Hosting
```

Ensure the frontend is configured to call the correct API base URL (e.g., `https://api.yourdomain.com`).

## SSL / HTTPS

Always use HTTPS in production. Recommended reverse proxy: **Caddy** (auto-HTTPS) or **Nginx** with Let's Encrypt.

### Caddy Example

```
api.yourdomain.com {
    reverse_proxy localhost:8080
}
```

### Nginx Example

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring & Logging

- **Docker logs**: `docker compose logs -f`
- **Systemd service** (optional): Create a systemd unit for `docker compose up` on boot
- **Health check**: The webhook receiver exposes `GET /` which returns `{"status": "online"}`

## Backup

The only stateful data is in `memory/` and `output/`:

```bash
# Backup script
rsync -avz memory/ output/ backup-server:/backups/qempire/
```

## Scaling Considerations

- The **planner** uses an LLM API call — rate limits apply
- The **executor** runs tools synchronously — consider queue-based workers (e.g., Celery + Redis) for high volume
- The **verifier** is lightweight and can run inline
- For multi-tenant usage, isolate client outputs into subdirectories under `output/`

## Rollback

Because the stack is Docker-based, rollbacks are simple:

```bash
git checkout <previous-tag>
docker compose up --build -d
```

## Support

- Read `docs/ARCHITECTURE.md` for system design details
- Read `AGENTS.md` for developer/contributor conventions
- Open an issue on GitHub for bugs or feature requests
