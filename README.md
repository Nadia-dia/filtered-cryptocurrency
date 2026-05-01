# Crypto Scanner

---

## How to Run

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install fastapi uvicorn httpx python-dotenv
uvicorn app.main:app --reload
```

- API: `http://localhost:8000/api/coins`
- Swagger: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

---

## What Was Completed

### Backend

- FastAPI REST endpoint: `GET /api/coins`
- CoinGecko `/coins/markets` integration (public API, no key)
- Async HTTP client with error handling and 15s timeout
- Modular filter layer — each criterion is an isolated, testable function
- CORS configured for React dev server (`localhost:5173`)
- Response shaped to only return fields needed by the frontend

### Frontend

- React + Vite app consuming the backend exclusively — no direct external API calls
- Coin table: name, symbol, price, 24h %, market cap, FDV, volume
- Search: partial match on name and symbol (client-side, instant)
- Additional FDV filter: user-defined upper bound in $M
- Sort by Market Cap or 24h Volume, ascending/descending toggle
- Clean dark-themed UI — functional and readable

---

## Assumptions & Limitations

### Filter Implementation Status

| Filter / Requirement         | Status     | Notes                                                                    |
| ---------------------------- | ---------- | ------------------------------------------------------------------------ |
| `market_cap > 0`             | ✅ Applied | Directly available in `/coins/markets`                                   |
| `FDV < $100M`                | ✅ Applied | `fully_diluted_valuation` field                                          |
| `24h Volume > $50k`          | ✅ Applied | `total_volume` field                                                     |
| `max_supply == total_supply` | ✅ Applied | Both fields present; null coins excluded; epsilon 1.0 for float rounding |
| `preview_listing == true`    | ❌ Omitted | Field does not exist in CoinGecko public API                             |
| `TVL > $50k`                 | ❌ Omitted | Not in bulk endpoint; per-coin calls would exceed free-tier rate limits  |

### Other Assumptions

- Free tier returns top 250 coins by market cap — large caps dominate, so the result set after `FDV < $100M` filtering is intentionally small or empty. This is correct behaviour.
- No server-side caching implemented. For production, a 5-minute TTL cache (Redis or in-memory) would be added to avoid rate limiting.
- FDV filter on the frontend is additive — it narrows the already-filtered backend result further.
- Epsilon of `1.0` used for `max_supply == total_supply` float comparison to handle CoinGecko rounding artefacts.

---

## AI Workflow

### Tools Used

- **Claude (claude.ai)** — primary tool for architecture, code generation, and decision-making
- **CoinGecko Docs** — verified field names and endpoint constraints manually

### How AI Was Used

**Architecture & planning**
Before writing any code, I used Claude to analyse the requirements and identify ambiguities — specifically which CoinGecko fields exist in the free public API. Claude flagged that `preview_listing` and TVL are not available in the public API, which saved time that would otherwise have been lost debugging missing fields.

**Code generation**
Claude generated initial scaffolds for `coingecko.py`, `filters.py`, and `main.py`. Each module was a focused prompt (service layer → filter layer → FastAPI wiring) rather than one large prompt, producing cleaner and more reviewable output. React components were generated with explicit requirements upfront: no external API calls, client-side filtering only, specific sort and search behaviour.

**Debugging**
When `/api/coins` returned an empty array, Claude correctly diagnosed the cause (FDV < $100M eliminates all top-250 large-cap coins) and suggested temporarily relaxing the threshold to verify data flow — a practical step rather than assuming a code error.

### Where AI Helped Most

- Rapid identification of API field availability issues before any code was written
- Generating the filter module with isolated, testable functions in one pass
- CORS setup and async `httpx` patterns — boilerplate that would otherwise require documentation lookup

### What Was Reviewed or Corrected Manually

- Verified that CoinGecko's `fully_diluted_valuation` matches the FDV definition in the requirements, not a manual `price × supply` calculation
- Adjusted the float epsilon for `max_supply == total_supply` after reviewing actual API response data — AI defaulted to strict equality which would silently drop valid coins
- Reviewed CORS origins to ensure only intended dev-server ports are whitelisted
- Confirmed the uvicorn run command path (`app.main:app`) matches the actual folder structure after moving `main.py` inside the `app/` package
