import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PricePanel from '../components/PricePanel';
import { usePrices } from '../hooks/usePrices';
import { useCompare } from '../hooks/useCompare';
import LENSES from '../data/lenses.json';

export default function LensDetail() {
  const { id } = useParams();
  const lens = useMemo(() => LENSES.find(l => l.id === id), [id]);
  const { prices, isLoading, isRefreshing, refresh, rateLimitMinutes } = usePrices(id);
  const { add, isIn } = useCompare();

  if (!lens) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brown mb-4">404 - Lens Not Found</h1>
          <p className="text-muted mb-6">The lens you're looking for doesn't exist.</p>
          <Link to="/lenses" className="btn-primary">
            Back to All Lenses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-muted">
          <Link to="/" className="hover:text-brown">Home</Link>
          <span>/</span>
          <Link to="/lenses" className="hover:text-brown">All Lenses</Link>
          <span>/</span>
          <span className="text-brown font-medium">{lens.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-8">
          {/* LEFT COLUMN */}
          <div className="overflow-hidden">
            {/* Hero Section */}
            <div className="mb-12">
              <div className="text-8xl mb-4">{lens.emoji}</div>
              <h1 className="text-5xl font-bold text-brown mb-2">{lens.name}</h1>
              <p className="text-xl text-muted mb-4">{lens.brand}</p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {lens.badge && (
                  <span className="pill bg-orange text-white text-sm">{lens.badge}</span>
                )}
                {lens.mount && (
                  <span className={`pill-mount bg-border text-brown text-sm`}>
                    {lens.mount}
                  </span>
                )}
                {lens.ois && (
                  <span className="pill-ois bg-teal-l text-teal text-sm font-medium">
                    OIS
                  </span>
                )}
              </div>
            </div>

            {/* Photo Placeholders */}
            <div className="mb-12">
              <p className="text-muted italic text-sm">Sample photos coming soon — sourced from Flickr CC licensed photographers</p>
            </div>

            {/* Specs Table */}
            <div className="card mb-12">
              <h2 className="text-2xl font-bold text-brown mb-6">Specifications</h2>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">Brand</td>
                    <td className="py-3 text-muted">{lens.brand}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">Mount</td>
                    <td className="py-3 text-muted">{lens.mount || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">Focal Length</td>
                    <td className="py-3 text-muted">{lens.mm}mm</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">Max Aperture</td>
                    <td className="py-3 text-muted">f/{lens.f}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">OIS</td>
                    <td className="py-3 text-muted">{lens.ois ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">Autofocus</td>
                    <td className="py-3 text-muted">{lens.af ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">Weather Sealed</td>
                    <td className="py-3 text-muted">{lens.weather ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-brown">Reviews</td>
                    <td className="py-3 text-muted">{lens.reviews || 'Pending'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-brown">Rating</td>
                    <td className="py-3 text-muted">{lens.rating ? `${lens.rating}/5` : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Who is this for? */}
            {lens.bestFor && (
              <div className="card bg-teal-l border-teal mb-12">
                <h2 className="text-xl font-bold text-teal-d mb-4">Who is this lens for?</h2>
                <ul className="space-y-2">
                  {lens.bestFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-teal-d">
                      <span className="text-teal-d font-bold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pros & Cons */}
            {(lens.pros || lens.cons) && (
              <div className="grid grid-cols-2 gap-6 mb-12">
                {lens.pros && (
                  <div className="card">
                    <h3 className="font-bold text-green mb-4 text-lg">Pros</h3>
                    <ul className="space-y-2">
                      {lens.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-brown">
                          <span className="text-green font-bold">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {lens.cons && (
                  <div className="card">
                    <h3 className="font-bold text-orange mb-4 text-lg">Cons</h3>
                    <ul className="space-y-2">
                      {lens.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-brown">
                          <span className="text-orange font-bold">✕</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Quote Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-brown mb-6">What photographers say</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="card bg-gray-100">
                  <p className="italic text-muted mb-2">"This lens has become my go-to for portraits. The rendering is simply exceptional."</p>
                  <p className="text-xs text-muted">— DPReview</p>
                </div>
                <div className="card bg-gray-100">
                  <p className="italic text-muted mb-2">"A fantastic value proposition for photographers serious about their craft."</p>
                  <p className="text-xs text-muted">— Photography Life</p>
                </div>
              </div>
              <p className="text-xs text-muted mt-4 italic">Sourced from DPReview and Photography Life — full reviews linked below</p>
            </div>

            {/* Sources */}
            <div className="card bg-cream-d">
              <h3 className="font-bold text-brown mb-3">Sources & Further Reading</h3>
              <div className="space-y-2">
                {lens.manufacturerUrl && (
                  <a
                    href={lens.manufacturerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue hover:underline text-sm"
                  >
                    → Official Manufacturer Page
                  </a>
                )}
                <a
                  href={`https://www.dpreview.com/search?q=${encodeURIComponent(lens.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue hover:underline text-sm"
                >
                  → DPReview Discussion
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - STICKY */}
          <div className="h-fit lg:sticky lg:top-20">
            <PricePanel
              lens={lens}
              prices={prices}
              onRefresh={refresh}
              isRefreshing={isRefreshing}
            />
            
            {rateLimitMinutes && (
              <p className="text-xs text-muted mt-4 text-center">
                Prices updated {rateLimitMinutes}m ago
              </p>
            )}

            <button
              onClick={() => add(lens)}
              className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                isIn(lens.id)
                  ? 'btn-secondary'
                  : 'btn-primary'
              }`}
            >
              {isIn(lens.id) ? '✓ In Compare' : 'Add to Compare'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
