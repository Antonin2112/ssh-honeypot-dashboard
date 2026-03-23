import StatsCards from '../components/StatsCards'
import EventsFeed from '../components/EventsFeed'
import WorldMap from '../components/WorldMap'
import AttacksChart from '../components/AttacksChart'

export default function Dashboard({ events, alerts }) {
  return (
    <div className="flex flex-col gap-4">
      <StatsCards events={events} alerts={alerts} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttacksChart events={events} />
        <WorldMap alerts={alerts} />
      </div>
      <EventsFeed events={events} />
    </div>
  )
}