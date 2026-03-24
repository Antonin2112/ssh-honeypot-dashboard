export default function TopCommands({ events }) {
  const commandEvents = events.filter(e => e.event_type === 'cowrie.command.input' && e.command)

  const topCommands = Object.entries(
    commandEvents.reduce((acc, e) => {
      acc[e.command] = (acc[e.command] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 10)

  const maxCount = topCommands[0]?.[1] || 1

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Top Commands</h2>
        <ul className="flex flex-col gap-2">
          {topCommands.map(([command, count]) => (
            <li key={command} className="flex items-center gap-2">
              <span className="font-mono text-xs flex-1 mr-2">{command}</span>
              <progress
                className="progress progress-accent flex-1"
                value={count}
                max={maxCount}
              />
              <span className="text-xs w-6 text-right">{count}</span>
            </li>
          ))}
          {topCommands.length === 0 && (
            <p className="text-base-content/50 text-sm">No commands yet</p>
          )}
        </ul>
      </div>
    </div>
  )
}
