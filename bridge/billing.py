"""Stripe billing — subscriptions + one-off credit packs, with a small entitlement store.

Entitlements (who has what plan / credit balance) live in memory/billing.json next
to bridge.json. Nothing here fakes a charge: without STRIPE_SECRET_KEY the API
returns an honest 'not configured' error.
"""
import json
import os
import threading

from core.config import (
    BRIDGE_PATH, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICES, PLAN_CREDITS, STRIPE_CREDIT_PACKS,
)

BILLING_PATH = os.path.join(os.path.dirname(BRIDGE_PATH), "billing.json")
_LOCK = threading.Lock()


class BillingNotConfigured(RuntimeError):
    """Raised when Stripe keys/prices are missing."""


def _stripe():
    if not STRIPE_SECRET_KEY:
        raise BillingNotConfigured("STRIPE_SECRET_KEY is not set")
    import stripe
    stripe.api_key = STRIPE_SECRET_KEY
    return stripe


# ---- entitlement store ----

def _load() -> dict:
    with _LOCK:
        if not os.path.exists(BILLING_PATH):
            return {}
        try:
            with open(BILLING_PATH) as f:
                return json.load(f)
        except Exception:
            return {}


def _save(data: dict) -> None:
    with _LOCK:
        os.makedirs(os.path.dirname(BILLING_PATH), exist_ok=True)
        tmp = BILLING_PATH + ".tmp"
        with open(tmp, "w") as f:
            json.dump(data, f, indent=2)
        os.replace(tmp, BILLING_PATH)


def get_entitlement(email: str) -> dict:
    return _load().get((email or "").lower(), {"plan": None, "credits": 0})


def grant_subscription(email: str, plan_id: str, customer_id: str = "") -> None:
    data = _load()
    key = (email or "").lower()
    ent = data.get(key, {"plan": None, "credits": 0})
    ent["plan"] = plan_id
    ent["credits"] = ent.get("credits", 0) + PLAN_CREDITS.get(plan_id, 0)
    if customer_id:
        ent["stripe_customer_id"] = customer_id
    data[key] = ent
    _save(data)


def grant_credits(email: str, credits: int, customer_id: str = "") -> None:
    data = _load()
    key = (email or "").lower()
    ent = data.get(key, {"plan": None, "credits": 0})
    ent["credits"] = ent.get("credits", 0) + int(credits)
    if customer_id:
        ent["stripe_customer_id"] = customer_id
    data[key] = ent
    _save(data)


# ---- checkout ----

def create_checkout(kind: str, item_id: str, email: str, success_url: str, cancel_url: str) -> str:
    """Create a Stripe Checkout Session and return its URL.

    kind: "subscription" (item_id = plan id) or "credits" (item_id = pack id).
    """
    stripe = _stripe()

    if kind == "subscription":
        price = STRIPE_PRICES.get(item_id)
        if not price:
            raise BillingNotConfigured(f"No Stripe price configured for plan '{item_id}'")
        mode = "subscription"
        metadata = {"kind": "subscription", "plan_id": item_id, "email": email}
        line_items = [{"price": price, "quantity": 1}]
    elif kind == "credits":
        pack = STRIPE_CREDIT_PACKS.get(item_id)
        if not pack or not pack[0]:
            raise BillingNotConfigured(f"No Stripe price configured for pack '{item_id}'")
        mode = "payment"
        metadata = {"kind": "credits", "pack_id": item_id, "credits": str(pack[1]), "email": email}
        line_items = [{"price": pack[0], "quantity": 1}]
    else:
        raise BillingNotConfigured(f"Unknown checkout kind '{kind}'")

    session = stripe.checkout.Session.create(
        mode=mode,
        line_items=line_items,
        customer_email=email or None,
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    return session.url


def create_portal(email: str, return_url: str) -> str:
    """Open the Stripe customer portal for an existing customer."""
    stripe = _stripe()
    ent = get_entitlement(email)
    customer_id = ent.get("stripe_customer_id")
    if not customer_id:
        raise BillingNotConfigured("No Stripe customer on file for this email")
    session = stripe.billing_portal.Session.create(customer=customer_id, return_url=return_url)
    return session.url


def handle_webhook(payload: bytes, sig_header: str) -> dict:
    """Verify a Stripe webhook and grant entitlements on completed checkout."""
    stripe = _stripe()
    if STRIPE_WEBHOOK_SECRET:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    else:
        event = json.loads(payload)  # dev only — no signature verification

    if event["type"] == "checkout.session.completed":
        s = event["data"]["object"]
        md = s.get("metadata", {}) or {}
        email = md.get("email") or s.get("customer_email") or ""
        customer_id = s.get("customer") or ""
        if md.get("kind") == "subscription":
            grant_subscription(email, md.get("plan_id", ""), customer_id)
        elif md.get("kind") == "credits":
            grant_credits(email, int(md.get("credits", 0)), customer_id)

    return {"received": True}
