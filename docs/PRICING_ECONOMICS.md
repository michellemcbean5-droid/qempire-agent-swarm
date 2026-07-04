# Q-Empire Pricing & Credit Economics

*How the credit system is priced so Q-Empire makes money on every run — never loses it.*

## The rule

The pricing **framework mirrors Manus** (credits + monthly plans + daily refill), but everything
is **priced ~30% below Manus**, and credits are **metered to real Kimi token usage** so a
**≥45% markup** is guaranteed on every task by construction.

## The reference: Manus

| Manus plan | Price | Credits | $ / credit |
|---|---|---|---|
| Free | $0 | 300/day + 1,000 | — |
| Standard | $20/mo | 4,000 | $0.0050 |
| Plus | $40/mo | 8,000 | $0.0050 |
| Extended | $200/mo | 40,000 | $0.0050 |

Manus values a credit at **$0.005**. Typical task costs: simple 10–50 credits, a website
build ≈ 360 credits.

## Our cost: Kimi (Moonshot) K2.5

- Input ≈ **$0.60 / 1M tokens**, output ≈ **$2.50 / 1M tokens** → blended ≈ **$1.40 / 1M tokens**
  (conservative; context caching makes it cheaper).

## The credit valuation (output-weighted, so margin holds for ANY task)

Output tokens cost ~4.2× input on Kimi. If we metered raw tokens, an output-heavy task could
wipe the margin. So we charge on **effective tokens**:

```
effective_tokens = input_tokens + output_tokens × 4.2
credits          = ceil(effective_tokens / 4000)
```

Since 1 effective token is priced at Kimi's *input* rate ($0.60/1M), the cost of a credit is
fixed **regardless of the input/output split**:

| Quantity | Value |
|---|---|
| Cost to serve 1 credit | 4,000 × $0.60/1M = **$0.0024** |
| We sell 1 credit for | **$0.0035** (30% below Manus's $0.005) |
| **Markup** | 0.0035 / 0.0024 − 1 = **+46%** ✅ (≥ 45% floor, any mix) |

Because credits are metered to **actual usage**, revenue is always ≥ cost × 1.46 on every task —
margin can only go **up**, never below the floor.

## Our plans (30% below Manus, same credit amounts)

Plans are just credits × $0.0035, so they carry the **same +46% markup** as buying credits.

| Q-Empire plan | Price | Credits | Manus equiv | Cost to serve | Markup |
|---|---|---|---|---|---|
| Tide Pool | $0 | 500/day + 1,000 | Free | (free tier, capped) | — |
| Current | **$14/mo** | 4,000 | $20 | $9.60 | **+46%** |
| Reef | **$28/mo** | 8,000 | $40 | $19.20 | **+46%** |
| Deep Blue | **$140/mo** | 40,000 | $200 | $96.00 | **+46%** |

> **Markup vs. margin:** +46% *markup* = ~31% *gross margin* (`(price−cost)/price`). The 45%
> figure is **markup**, and it's met on every credit and every plan. Tune `TOKENS_PER_CREDIT`,
> `OUTPUT_WEIGHT`, and `CREDIT_SELL_USD` in `core/config.py` to move the floor.

### Worked example

A build using **150K input + 40K output** tokens →
`effective = 150,000 + 40,000×4.2 = 318,000` → **80 credits**.
- Revenue: 80 × $0.0035 = **$0.28**
- Kimi cost: 150K×$0.60/1M + 40K×$2.50/1M = $0.09 + $0.10 = **$0.19**
- Markup: **+47%** ✅

## Levers (in `core/config.py`)

- `TOKENS_PER_CREDIT` (default **1700**) — lower = more margin, fewer tokens per credit.
- `CREDIT_SELL_USD` (default **0.0035**) — our price per credit.
- `TARGET_MARKUP` (default **0.45**).
- `KIMI_API_KEY` / `KIMI_MODEL` / `KIMI_BASE_URL` — the paid-user model.

## Free tier & abuse control

- Free users get **500 credits/day** (more than Manus's 300) but no monthly pool.
- Paying **before builds run** (card on file) prevents free-tier abuse from costing you money.
- Users may **bring their own key** — then inference cost is entirely theirs and you still
  collect the subscription.
