"""Configuration for Q-Empire Mermaid OS backend."""
import os
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Q-Empire Mermaid OS"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "******localhost:5432/qempire_mermaid_os",
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "change-me-in-production")

    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_PRICE_STARTER: str = os.getenv("STRIPE_PRICE_STARTER", "")
    STRIPE_PRICE_FOUNDATION: str = os.getenv("STRIPE_PRICE_FOUNDATION", "")
    STRIPE_PRICE_EMPIRE_PRO: str = os.getenv("STRIPE_PRICE_EMPIRE_PRO", "")
    STRIPE_PRICE_ENTERPRISE: str = os.getenv("STRIPE_PRICE_ENTERPRISE", "")

    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "claude-sonnet-4-20250514")

    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
