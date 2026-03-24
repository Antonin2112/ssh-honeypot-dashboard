import AlertsPanel from '../components/AlertsPanel'
import TopCredentials from '../components/TopCredentials'
import TopCommands from '../components/TopCommands'

export default function Analysis({ events, alerts }) {
  return (
    <div className="flex flex-col gap-4">
      <AlertsPanel alerts={alerts} />
      <TopCredentials events={events} />
      <TopCommands events={events} />
    </div>
  )
}