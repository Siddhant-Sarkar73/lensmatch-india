import { Link } from 'react-router-dom'
import { Camera, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brown text-white mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Camera size={18} className="text-orange" />
              <span className="text-lg font-black">
                <span className="text-orange">Lens</span>Match India
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Your complete portrait lens research companion — all brands, all mounts, real Indian prices.
            </p>
          </div>

          {/* Journeys */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Journeys</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/find" className="hover:text-orange transition-colors">Find My Lens</Link></li>
              <li><Link to="/lenses" className="hover:text-orange transition-colors">Browse All Lenses</Link></li>
              <li><Link to="/compare" className="hover:text-orange transition-colors">Compare Lenses</Link></li>
              <li><Link to="/rent" className="hover:text-orange transition-colors">Rent a Lens</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Learn</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/learn" className="hover:text-orange transition-colors">Education Hub</Link></li>
              <li><Link to="/learn/aperture" className="hover:text-orange transition-colors">Understanding Aperture</Link></li>
              <li><Link to="/learn/mounts" className="hover:text-orange transition-colors">Camera Mounts Explained</Link></li>
              <li><Link to="/learn/india-buying" className="hover:text-orange transition-colors">Buying in India</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">About</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><span className="text-white/40">No affiliate links</span></li>
              <li><span className="text-white/40">No sponsored content</span></li>
              <li><span className="text-white/40">All claims sourced</span></li>
              <li><span className="text-white/40">Privacy-first analytics</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © 2025 LensMatch India · Prices updated twice daily · Not affiliated with any camera brand
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Made with <Heart size={12} className="text-orange fill-orange" /> for Indian photographers
          </p>
        </div>
      </div>
    </footer>
  )
}
