import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Camera } from 'lucide-react'

const links = [
  { to: '/lenses', label: 'All Lenses' },
  { to: '/find',   label: 'Find My Lens' },
  { to: '/rent',   label: 'Rent' },
  { to: '/learn',  label: 'Learn' },
  { to: '/compare',label: 'Compare' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Camera size={20} className="text-orange" />
          <span className="text-xl font-black">
            <span className="text-orange">Lens</span>
            <span className="text-brown">Match</span>
          </span>
          <span className="hidden sm:inline text-xs font-bold text-muted bg-cream-d px-2 py-0.5 rounded-full ml-1">India</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-bold transition-colors ${isActive ? 'text-orange' : 'text-brown-l hover:text-brown'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <Link to="/find" className="hidden md:inline-flex btn-primary text-sm shrink-0">
          Find My Lens →
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-cream-d transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-3">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-bold py-2 border-b border-border/50 ${isActive ? 'text-orange' : 'text-brown-l'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/find"
            onClick={() => setOpen(false)}
            className="btn-primary text-sm text-center mt-2"
          >
            Find My Lens →
          </Link>
        </div>
      )}
    </nav>
  )
}
