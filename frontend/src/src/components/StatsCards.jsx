export default function StatsCards({ events = [], alerts = [], activeSessions = 0 }) {
  const totalAttacks = events.length

  const uniqueIPs = new Set(events.map(e => e.ip).filter(Boolean)).size

  const maliciousIPs = alerts.filter(a => a.isMalicious).length


  return (
    <div className="stats stats-horizontal shadow w-full">
      <div className="stat">
        <div className="stat-title">Total Events</div>
        <div className="stat-value text-primary">{totalAttacks}</div>
        <div className="stat-desc">All Cowrie events</div>
      </div>

      <div className="stat">
        <div className="stat-title">Unique IPs</div>
        <div className="stat-value text-secondary">{uniqueIPs}</div>
        <div className="stat-desc">Distinct attackers</div>
      </div>

      <div className="stat">
        <div className="stat-title">Active Sessions</div>
        <div className="stat-value text-accent">{activeSessions}</div>
        <div className="stat-desc">Currently connected</div>
      </div>

      <div className="stat">
        <div className="stat-title">Malicious IPs</div>
        <div className="stat-value text-error">{maliciousIPs}</div>
        <div className="stat-desc">Flagged by AbuseIPDB</div>
      </div>
    </div>
  )
}
