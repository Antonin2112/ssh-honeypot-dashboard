import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <span className="text-xl font-bold">CyberWatch</span>
      </div>
      <div className="flex-none">
        <Link to="/" className="btn btn-ghost">Dashboard</Link>
        <Link to="/analysis" className="btn btn-ghost">Analysis</Link>
      </div>
    </div>
  )
}