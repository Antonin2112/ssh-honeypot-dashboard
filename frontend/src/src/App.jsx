import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useData } from './hooks/useData'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'

export default function App() {
  const { events, alerts, activeSessions } = useData()

  return (
    <BrowserRouter>
      <div data-theme="dim" className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard events={events} alerts={alerts} activeSessions={activeSessions}/>} />
            <Route path="/analysis" element={<Analysis events={events} alerts={alerts} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}