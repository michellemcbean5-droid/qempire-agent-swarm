"""Q-Empire Mermaid OS — FastAPI backend entry point."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api import auth, connectors, workflows, agents, billing, webhooks


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    print("[Q-EMPIRE] Mermaid OS backend starting...")
    yield
    print("[Q-EMPIRE] Mermaid OS backend shutting down...")


app = FastAPI(
    title="Q-Empire Mermaid OS API",
    description="Self-service automation platform backend.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(connectors.router, prefix="/api/v1/connectors", tags=["Connectors"])
app.include_router(workflows.router, prefix="/api/v1/workflows", tags=["Workflows"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(billing.router, prefix="/api/v1/billing", tags=["Billing"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])


@app.get("/health")
async def health_check():
    return {"status": "online", "service": "Q-Empire Mermaid OS", "version": "1.0.0"}
