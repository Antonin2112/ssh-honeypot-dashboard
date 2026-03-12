import { useState, useEffect } from 'react'

const API1 = import.meta.env.VITE_API1_URL
const API2 = import.meta.env.VITE_API2_URL

export default function App() {
  const [events, setEvents] = useState([])
  const [alerts, setAlerts] = useState([])

  const fetchData = async () => {
    // Récupère les events depuis API1
    const eventsRes = await fetch(`${API1}/events`)
    const eventsData = await eventsRes.json()
    setEvents(eventsData)

    // Extrait les IPs uniques et les envoie à API2
    const uniqueIps = [...new Set(eventsData.map(e => e.ip).filter(Boolean))]
    for (const ip of uniqueIps) {
      await fetch(`${API2}/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      })
    }

    // Récupère les alertes depuis API2
    const alertsRes = await fetch(`${API2}/alerts`)
    const alertsData = await alertsRes.json()
    setAlerts(alertsData)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px', background: '#111', color: '#eee', minHeight: '100vh' }}>
      <h1>🛡️ CyberWatch Dashboard</h1>

      <h2>📋 Cowrie Events ({events.length})</h2>
      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333' }}>
            <th>IP</th><th>Type</th><th>User</th><th>Password</th><th>Command</th><th>Time</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.id} style={{ background: e.event_type === 'cowrie.login.success' ? '#1a3a1a' : '#1a1a1a' }}>
              <td>{e.ip}</td>
              <td>{e.event_type}</td>
              <td>{e.username || '-'}</td>
              <td>{e.password || '-'}</td>
              <td>{e.command || '-'}</td>
              <td>{new Date(e.timestamp).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>🚨 Alerts ({alerts.length})</h2>
      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333' }}>
            <th>IP</th><th>Country</th><th>City</th><th>ISP</th><th>Abuse Score</th><th>Malicious</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a._id} style={{ background: a.isMalicious ? '#3a1a1a' : '#1a1a1a' }}>
              <td>{a.ip}</td>
              <td>{a.country}</td>
              <td>{a.city}</td>
              <td>{a.isp}</td>
              <td>{a.abuseScore}/100</td>
              <td>{a.isMalicious ? '⚠️ YES' : '✅ NO'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}