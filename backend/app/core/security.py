"""Security utilities for Q-Empire Mermaid OS."""
import base64
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

from cryptography.fernet import Fernet
from jose import jwt, JWTError

from backend.app.core.config import get_settings


settings = get_settings()


def _derive_fernet_key(key: str) -> bytes:
    """Derive a 32-byte URL-safe base64 Fernet key from any string."""
    digest = hashlib.sha256(key.encode()).digest()
    return base64.urlsafe_b64encode(digest)


def get_cipher() -> Fernet:
    return Fernet(_derive_fernet_key(settings.ENCRYPTION_KEY))


def encrypt_secret(plain_text: str) -> str:
    """Encrypt an API key or OAuth token."""
    return get_cipher().encrypt(plain_text.encode()).decode()


def decrypt_secret(cipher_text: str) -> str:
    """Decrypt an API key or OAuth token."""
    return get_cipher().decrypt(cipher_text.encode()).decode()


def hash_password(password: str) -> str:
    """Hash a password with a random salt."""
    salt = secrets.token_hex(16)
    pwdhash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return salt + pwdhash.hex()


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    salt = hashed[:32]
    pwdhash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return hmac.compare_digest(salt + pwdhash.hex(), hashed)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        return None


def generate_webhook_path() -> str:
    """Generate a unique webhook path segment."""
    return secrets.token_urlsafe(24)
