import { useState, useEffect, useMemo } from "react";
import CoinTable from "./CoinTable";
import Filters from "./Filters";
import "./App.css";

const API_URL = "http://localhost:8000/api/coins";

export default function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [maxFdv, setMaxFdv] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Backend error: ${r.status}`);
        return r.json();
      })
      .then(setCoins)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const displayed = useMemo(() => {
    let result = [...coins];

    // Search by name
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q),
      );
    }

    // Additional FDV filter
    if (maxFdv !== "" && !isNaN(Number(maxFdv))) {
      const cap = Number(maxFdv) * 1_000_000; // user inputs in $M
      result = result.filter(
        (c) => c.fully_diluted_valuation && c.fully_diluted_valuation < cap,
      );
    }

    // Sort
    result.sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });

    return result;
  }, [coins, search, maxFdv, sortBy, sortDir]);

  return (
    <div className="app">
      <header>
        <h1>Crypto Project</h1>
        <p className="subtitle">
          Filtered by: mcap &gt; 0 · FDV &lt; $100M · Vol &gt; $50k · Max =
          Total Supply
        </p>
      </header>

      <Filters
        search={search}
        setSearch={setSearch}
        maxFdv={maxFdv}
        setMaxFdv={setMaxFdv}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
      />

      {loading && <p className="state">Loading from backend…</p>}
      {error && <p className="state error">⚠ {error}</p>}
      {!loading && !error && (
        <p className="count">{displayed.length} coins match</p>
      )}
      {!loading && !error && <CoinTable coins={displayed} />}
    </div>
  );
}
