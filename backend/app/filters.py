def apply_filters(coins: list[dict]) -> list[dict]:
    return [c for c in coins if passes_all(c)]


def passes_all(coin: dict) -> bool:
    return (
        has_positive_mcap(coin)
        and has_low_fdv(coin)
        and has_high_volume(coin)
        and max_equals_total_supply(coin)
    )


def has_positive_mcap(coin: dict) -> bool:
    mcap = coin.get("market_cap") or 0
    return mcap > 0


def has_low_fdv(coin: dict, threshold: float = 100_000_000) -> bool:
    fdv = coin.get("fully_diluted_valuation") or 0
    return 0 < fdv < threshold


def has_high_volume(coin: dict, threshold: float = 50_000) -> bool:
    vol = coin.get("total_volume") or 0
    return vol > threshold


def max_equals_total_supply(coin: dict) -> bool:
    max_s = coin.get("max_supply")
    total_s = coin.get("total_supply")
    # Both must be non-null and equal (float comparison with small epsilon)
    if max_s is None or total_s is None:
        return False
    return abs(max_s - total_s) < 1.0   # epsilon for float rounding