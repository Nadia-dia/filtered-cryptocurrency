export default function Filters({
  search,
  setSearch,
  maxFdv,
  setMaxFdv,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
}) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by name or symbol…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max FDV ($M) e.g. 50"
        value={maxFdv}
        min={0}
        onChange={(e) => setMaxFdv(e.target.value)}
      />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="market_cap">Sort: Market Cap</option>
        <option value="total_volume">Sort: 24h Volume</option>
      </select>

      <button
        onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
      >
        {sortDir === "desc" ? "↓ Desc" : "↑ Asc"}
      </button>
    </div>
  );
}
