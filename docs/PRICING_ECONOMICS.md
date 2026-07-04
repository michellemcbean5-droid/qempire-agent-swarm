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

## The credit valuation

We define **1 credit = 1,700 Kimi tokens** (blended) and charge
`credits = ceil(tokens_used / 1,700)` per run.

| Quantity | Value |
|---|---|
| Cost to serve 1 credit | 1,700 × $1.40/1M = **$0.00238** |
| We sell 1 credit for | **$0.0035** (30% below Manus's $0.005) |
| **Markup** | 0.0035 / 0.00238 − 1 = **+47%** ✅ (target 45%) |

Because credits are metered to **actual tokens used**, revenue is always ≥ cost × 1.47 on
every task — margin can only go **up** (when a task uses fewer tokens than budgeted), never
below the floor.

## Our plans (30% below Manus, same credit amounts)

| Q-Empire plan | Price | Credits | Manus equiv | Est. cost to serve* | Gross margin* |
|---|---|---|---|---|---|
| Tide Pool | $0 | 500/day + 1,000 | Free | (free tier, capped) | — |
| Current | **$14/mo** | 4,000 | $20 | ~$9.52 | ~32% |
| Reef | **$28/mo** | 8,000 | $40 | ~$19.04 | ~32% |
| Deep Blue | **$140/mo** | 40,000 | $200 | ~$95.20 | ~32% |

\* *Worst case, assuming a user burns 100% of plan credits at max token density. In practice
most credits go unused or use fewer tokens, so realized margin is higher. Per-credit sale still
carries the +47% markup.*

> Note on plans vs. per-credit: the **per-credit** markup is +47%. The **plan** margin above
> (~32% worst-case) is lower only because plans bundle credits at a slight volume discount and
> assume 100% burn. To hold a strict **45% floor on plans too**, either (a) meter at
> **1,600 tokens/credit**, or (b) set plans to **$16 / $32 / $160**. Current defaults favor being
> cheaper than Manus; adjust `TOKENS_PER_CREDIT` / `CREDIT_SELL_USD` in `core/config.py`.

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
