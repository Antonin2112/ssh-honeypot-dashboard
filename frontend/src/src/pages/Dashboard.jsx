import StatsCards from '../components/StatsCards'
import EventsFeed from '../components/EventsFeed'
import WorldMap from '../components/WorldMap'
import AttacksChart from '../components/AttacksChart'

export default function Dashboard({ events, alerts }) {
  return (
    <div>
      <StatsCards events={events} alerts={alerts} />
      <EventsFeed events={events} />
      <WorldMap alerts={alerts} />
      <AttacksChart events={events} />
    </div>
  )
}