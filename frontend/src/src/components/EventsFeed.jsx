export default function EventsFeed({ events }) {
  const getRowColor = (eventType) => {
    if (eventType === 'cowrie.login.success') return 'bg-success/10'
    if (eventType === 'cowrie.login.failed') return 'bg-error/10'
    return ''
  }

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Live Events ({events.length})</h2>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="table table-xs table-pin-rows">
            <thead>
              <tr>
                <th>IP</th>
                <th>Type</th>
                <th>User</th>
                <th>Password</th>
                <th>Command</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className={getRowColor(e.event_type)}>
                  <td className="font-mono">{e.ip}</td>
                  <td>
                    <span className="badge badge-ghost badge-sm">{e.event_type}</span>
                  </td>
                  <td>{e.username || '-'}</td>
                  <td>{e.password || '-'}</td>
                  <td className="font-mono">{e.command || '-'}</td>
                  <td>{new Date(e.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}