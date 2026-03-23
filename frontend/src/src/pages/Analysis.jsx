import AlertsPanel from '../components/AlertsPanel'
import TopCredentials from '../components/TopCredentials'
import TopCommands from '../components/TopCommands'

export default function Analysis({ events, alerts }) {
  return (
    <div>
      <AlertsPanel alerts={alerts} />
      <TopCredentials events={events} />
      <TopCommands events={events} />
    </div>
  )
}