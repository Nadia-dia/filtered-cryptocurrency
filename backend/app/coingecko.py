import httpx
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("COINGECKO_BASE_URL", "https://api.coingecko.com/api/v3")

async def fetch_coins() -> list[dict]:
    """
    Fetches up to 250 coins from CoinGecko public /coins/markets endpoint.
    Returns raw list. Filtering happens separately.
    """
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 250,       # max per request on free tier
        "page": 1,
        "sparkline": False,
        "price_change_percentage": "24h",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{BASE_URL}/coins/markets", params=params)
        response.raise_for_status()
        return response.json()