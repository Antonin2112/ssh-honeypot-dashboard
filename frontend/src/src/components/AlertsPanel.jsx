
export default function AlertsPanel({ alerts }) {
  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Alerts ({alerts.length})</h2>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="table table-xs table-pin-rows">
            <thead>
              <tr>
                <th>IP</th>
                <th>Country</th>
                <th>City</th>
                <th>ISP</th>
                <th>Abuse Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a._id} className={a.isMalicious ? 'bg-error/10' : ''}>
                  <td className="font-mono">{a.ip}</td>
                  <td>{a.country}</td>
                  <td>{a.city}</td>
                  <td className="max-w-32 truncate">{a.isp}</td>
                  <td>
                    <progress
  className={`progress w-16 ${a.abuseScore > 50 ? 'progress-error' : 'progress-warning'}`}
  value={a.abuseScore}
  max="100"
/>
                    <span className="ml-1 text-xs">{a.abuseScore}</span>
                  </td>
                  <td>
                    {a.isMalicious
                      ? <span className="badge badge-error badge-sm">Malicious</span>
                      : <span className="badge badge-success badge-sm">Clean</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
