import { Link } from 'react-router-dom'
import { BarChart2, Star } from 'lucide-react'

const BADGE_STYLES = {
  popular: 'bg-orange text-white',
  new:     'bg-green text-white',
  budget:  'bg-blue text-white',
}

const BADGE_LABELS = {
  popular: '🔥 Popular',
  new:     '✨ New',
  budget:  '💰 Budget',
}

export default function LensCard({ lens, onCompare, inCompare, layout = 'grid' }) {
  const drop = lens.was ? Math.round(((lens.was - lens.price) / lens.was) * 100) : 0
  const stars = Math.round(lens.rating)

  if (layout === 'list') {
    return (
      <div className="card flex overflow-hidden hover:shadow-card-lg transition-shadow">
        {/* Thumbnail */}
        <div className="w-36 shrink-0 bg-cream-d flex items-center justify-center text-4xl relative">
          {lens.emoji}
          {lens.badge && (
            <span className={`absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.5 rounded ${BADGE_STYLES[lens.badge]}`}>
              {BADGE_LABELS[lens.badge]}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 p-4 flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-muted mb-0.5">{lens.brand}</p>
            <h3 className="font-bold text-brown text-sm leading-snug mb-2 line-clamp-2">{lens.name}</h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="pill pill-mount">{lens.mount}-mount</span>
              <span className="pill">{lens.mm}mm f/{lens.f}</span>
              {lens.ois && <span className="pill pill-ois">OIS</span>}
              {lens.weather && <span className="pill">Sealed</span>}
              {!lens.af && <span className="pill">Manual</span>}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
              <span>{lens.rating} ({lens.reviews.toLocaleString('en-IN')})</span>
            </div>
          </div>

          {/* Price + actions */}
          <div className="shrink-0 text-right flex flex-col items-end gap-2">
            <div>
              <p className="text-lg font-black text-brown">₹{lens.price.toLocaleString('en-IN')}</p>
              {lens.was && (
                <p className="text-xs text-muted">
                  <span className="line-through">₹{lens.was.toLocaleString('en-IN')}</span>
                  <span className="text-green font-bold ml-1">↓{drop}%</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onCompare?.(lens)}
                className={`p-2 rounded-lg border transition-colors ${inCompare ? 'bg-orange border-orange text-white' : 'border-border text-muted hover:border-orange hover:text-orange'}`}
                title="Add to compare"
              >
                <BarChart2 size={14} />
              </button>
              <Link to={`/lens/${lens.id}`} className="btn-primary text-xs py-2 px-3">View →</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="card overflow-hidden hover:shadow-card-lg hover:-translate-y-0.5 transition-all flex flex-col">
      {/* Image area */}
      <div className="h-40 bg-cream-d flex items-center justify-center text-5xl relative">
        {lens.emoji}
        {lens.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-black px-2 py-0.5 rounded-md ${BADGE_STYLES[lens.badge]}`}>
            {BADGE_LABELS[lens.badge]}
          </span>
        )}
        <button
          onClick={() => onCompare?.(lens)}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors ${inCompare ? 'text-orange' : 'text-muted hover:text-orange'}`}
          title={inCompare ? 'Remove from compare' : 'Add to compare'}
        >
          <BarChart2 size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">{lens.brand}</p>
        <h3 className="font-bold text-sm text-brown leading-snug mb-2 flex-1">{lens.name}</h3>

        <div className="flex flex-wrap gap-1 mb-3">
          <span className="pill pill-mount">{lens.mount}-mount</span>
          <span className="pill">{lens.mm}mm f/{lens.f}</span>
          {lens.ois && <span className="pill pill-ois">OIS</span>}
          {!lens.af && <span className="pill">Manual</span>}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted mb-3">
          <span className="stars text-sm">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span>{lens.rating} ({lens.reviews.toLocaleString('en-IN')})</span>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="font-black text-brown text-base">₹{lens.price.toLocaleString('en-IN')}</p>
            {lens.was && (
              <p className="text-xs">
                <span className="line-through text-muted">₹{lens.was.toLocaleString('en-IN')}</span>
                <span className="text-green font-bold ml-1">↓{drop}%</span>
              </p>
            )}
          </div>
          <Link to={`/lens/${lens.id}`} className="btn-primary text-xs py-2 px-3">View →</Link>
        </div>
      </div>
    </div>
  )
}
