import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AttacksChart({ events }) {
  const data = events.reduce((acc, event) => {
    const hour = new Date(event.timestamp).getHours() + 'h'
    const existing = acc.find(d => d.hour === hour)
    if (existing) {
      existing.attacks++
    } else {
      acc.push({ hour, attacks: 1 })
    }
    return acc
  }, []).sort((a, b) => parseInt(a.hour) - parseInt(b.hour))

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Attacks per Hour</h2>
        {data.length === 0 ? (
          <p className="text-base-content/50 text-sm">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1d232a', border: 'none' }}
              />
              <Bar dataKey="attacks" fill="#7480ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
