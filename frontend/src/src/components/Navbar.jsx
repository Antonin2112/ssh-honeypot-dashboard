import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="navbar bg-base-300 shadow-md px-4">
      <div className="flex-1">
        <span className="text-xl font-bold tracking-wide">CyberWatch</span>
      </div>
      <div className="flex-none gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}
          }
        >
          Analysis
        </NavLink>
      </div>
    </div>
  )
}