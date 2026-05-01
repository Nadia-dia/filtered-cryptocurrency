const fmt = (n, digits = 0) =>
  n == null
    ? "—"
    : "$" +
      Number(n).toLocaleString("en-US", { maximumFractionDigits: digits });

const pct = (n) =>
  n == null ? (
    "—"
  ) : (
    <span style={{ color: n >= 0 ? "#22c55e" : "#ef4444" }}>
      {n >= 0 ? "+" : ""}
      {n.toFixed(2)}%
    </span>
  );

export default function CoinTable({ coins }) {
  if (!coins.length)
    return <p className="state">No coins match your filters.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>24h %</th>
            <th>Market Cap</th>
            <th>FDV</th>
            <th>24h Volume</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td className="coin-name">
                {c.image && (
                  <img src={c.image} alt={c.symbol} width={20} height={20} />
                )}
                <strong>{c.name}</strong>
                <span className="symbol">{c.symbol}</span>
              </td>
              <td>{fmt(c.current_price, 4)}</td>
              <td>{pct(c.price_change_percentage_24h)}</td>
              <td>{fmt(c.market_cap)}</td>
              <td>{fmt(c.fully_diluted_valuation)}</td>
              <td>{fmt(c.total_volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
