from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.coingecko import fetch_coins
from app.filters import apply_filters

app = FastAPI(title="Crypto Filter API")

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/coins")
async def get_coins():
    """
    Returns filtered list of coins from CoinGecko.
    Applied filters:
      - market_cap > 0
      - fully_diluted_valuation < $100M
      - 24h volume > $50k
      - max_supply == total_supply (non-null)
    Omitted (not in public API): preview_listing, TVL
    """
    try:
        raw = await fetch_coins()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"CoinGecko error: {str(e)}")

    filtered = apply_filters(raw)

    # Return only fields the frontend needs
    return [
        {
            "id": c["id"],
            "name": c["name"],
            "symbol": c["symbol"].upper(),
            "image": c.get("image"),
            "market_cap": c.get("market_cap"),
            "fully_diluted_valuation": c.get("fully_diluted_valuation"),
            "total_volume": c.get("total_volume"),
            "current_price": c.get("current_price"),
            "price_change_percentage_24h": c.get("price_change_percentage_24h"),
            "max_supply": c.get("max_supply"),
            "total_supply": c.get("total_supply"),
        }
        for c in filtered
    ]