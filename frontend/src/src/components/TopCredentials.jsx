export default function TopCredentials({ events }) {
  const loginEvents = events.filter(e => e.event_type === 'cowrie.login.failed' || e.event_type === 'cowrie.login.success')

  const topPasswords = Object.entries(
    loginEvents.reduce((acc, e) => {
      if (e.password) acc[e.password] = (acc[e.password] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 10)

  const topUsernames = Object.entries(
    loginEvents.reduce((acc, e) => {
      if (e.username) acc[e.username] = (acc[e.username] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 10)

  const maxPassword = topPasswords[0]?.[1] || 1
  const maxUsername = topUsernames[0]?.[1] || 1

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card bg-base-200 shadow">
        <div className="card-body p-4">
          <h2 className="card-title text-base">Top Passwords</h2>
          <ul className="flex flex-col gap-2">
            {topPasswords.map(([password, count]) => (
              <li key={password} className="flex items-center gap-2">
                <span className="font-mono text-sm w-28 truncate">{password}</span>
                <progress
                  className="progress progress-primary flex-1"
                  value={count}
                  max={maxPassword}
                />
                <span className="text-xs w-6 text-right">{count}</span>
              </li>
            ))}
            {topPasswords.length === 0 && <p className="text-base-content/50 text-sm">No data yet</p>}
          </ul>
        </div>
      </div>

      <div className="card bg-base-200 shadow">
        <div className="card-body p-4">
          <h2 className="card-title text-base">Top Usernames</h2>
          <ul className="flex flex-col gap-2">
            {topUsernames.map(([username, count]) => (
              <li key={username} className="flex items-center gap-2">
                <span className="font-mono text-sm w-28 truncate">{username}</span>
                <progress
                  className="progress progress-secondary flex-1"
                  value={count}
                  max={maxUsername}
                />
                <span className="text-xs w-6 text-right">{count}</span>
              </li>
            ))}
            {topUsernames.length === 0 && <p className="text-base-content/50 text-sm">No data yet</p>}
          </ul>
        </div>
      </div>
    </div>
  )
}