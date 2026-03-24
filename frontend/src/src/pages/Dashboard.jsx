import StatsCards from '../components/StatsCards'
import EventsFeed from '../components/EventsFeed'
import WorldMap from '../components/WorldMap'
import AttacksChart from '../components/AttacksChart'

export default function Dashboard({ events, alerts, activeSessions }) {
  return (
    <div className="flex flex-col gap-4">
      <StatsCards events={events} alerts={alerts} activeSessions={activeSessions} />
      <WorldMap alerts={alerts} />
      <AttacksChart events={events} />
      <EventsFeed events={events} />
    </div>
  )
}