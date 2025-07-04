import { useAuth } from '../context/AuthContext'
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuth()

  const navLinkStyles = ({ isActive }) => 
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-dark-800 border-b border-dark-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AU</span>
              </div>
              <h1 className="text-white font-bold text-xl hidden sm:block">
                Gold Assistant
              </h1>
            </Link>
            <div className="hidden sm:flex items-center space-x-6">
              <NavLink to="/dashboard" className={navLinkStyles}>Dashboard</NavLink>
              <NavLink to="/backtesting" className={navLinkStyles}>Backtesting</NavLink>
              <NavLink to="/settings" className={navLinkStyles}>Settings</NavLink>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-gray-400 text-xs">
                {user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar