import { useState, useEffect } from 'react'

const API1 = import.meta.env.VITE_API1_URL
const API2 = import.meta.env.VITE_API2_URL

export const useData = () => {
  const [events, setEvents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [activeSessions, setActiveSessions] = useState(0)

  const fetchData = async () => {
    try {
      const eventsRes = await fetch(`${API1}/events`)
      const eventsData = await eventsRes.json()
      setEvents(eventsData)

      const activeRes = await fetch(`${API1}/stats/active-sessions`)
      const activeData = await activeRes.json()
      setActiveSessions(activeData.active)

      const uniqueIps = [...new Set(eventsData.map(e => e.ip).filter(Boolean))]
      for (const ip of uniqueIps) {
        await fetch(`${API2}/analyse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip })
        })
      }

      const alertsRes = await fetch(`${API2}/alerts`)
      const alertsData = await alertsRes.json()
      setAlerts(alertsData)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return { events, alerts, activeSessions}
}