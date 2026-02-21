import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, X } from 'lucide-react';
import { useCompare } from '../hooks/useCompare';

export default function Compare() {
  const compare = useCompare();
  const navigate = useNavigate();

  // compareList already contains full lens objects (not IDs)
  const compareLenses = compare.compareList;

  if (compareLenses.length < 2) {
    return (
      <div className="font-nunito bg-cream min-h-screen py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* HEADER */}
          <div className="mb-12">
            <Link to="/" className="text-teal font-semibold hover:text-teal-d transition mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">Compare Lenses</h1>
          </div>

          {/* EMPTY STATE */}
          <div className="bg-white border-2 border-border rounded-lg p-12 text-center">
            <div className="text-5xl mb-6">⚖️</div>
            <h2 className="text-2xl font-bold text-brown mb-3">Select 2–3 lenses to compare</h2>
            <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
              Use the compare buttons on lens cards to select lenses you want to compare side-by-side. You can compare up to 3 lenses at once.
            </p>

            <Link to="/lenses" className="btn-primary inline-block mb-12">
              Browse Lenses →
            </Link>

            {/* PLACEHOLDER SLOTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className="bg-cream-d border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center min-h-48"
                >
                  <div className="text-4xl mb-4 opacity-50">+</div>
                  <p className="text-brown font-semibold mb-3">Slot {slot}</p>
                  <Link to="/lenses" className="text-teal font-semibold hover:text-teal-d transition">
                    Add Lens
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COMPARISON MODE
  return (
    <div className="font-nunito bg-cream min-h-screen py-12">
      <div className="max-w-full mx-auto px-6">
        {/* HEADER */}
        <div className="mb-12">
          <Link to="/lenses" className="text-teal font-semibold hover:text-teal-d transition mb-4 inline-block">
            ← Back to Catalogue
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-brown mb-2">Compare Lenses</h1>
          <p className="text-muted text-lg">{compareLenses.length} lenses selected</p>
        </div>

        {/* COMPARISON TABLE - DESKTOP */}
        <div className="hidden md:block bg-white rounded-lg border-2 border-border overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* HEADER ROW - Lens Names */}
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="px-6 py-4 text-left font-bold text-brown bg-cream-d" style={{ minWidth: '180px' }}>
                    Lens
                  </th>
                  {compareLenses.map((lens) => (
                    <th
                      key={lens.id}
                      className="px-6 py-4 text-center font-bold text-brown bg-white"
                      style={{ minWidth: '200px' }}
                    >
                      <div className="mb-2 text-2xl">{lens.emoji || '📷'}</div>
                      <div className="truncate">{lens.name}</div>
                      <button
                        onClick={() => compare.remove(lens.id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-2 inline-flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* PRICE */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Price</td>
                  {compareLenses.map((lens) => {
                    const minPrice = Math.min(...compareLenses.map(l => l.price || 0));
                    const isBest = lens.price === minPrice;
                    return (
                      <td
                        key={lens.id}
                        className={`px-6 py-3 text-center font-bold ${
                          isBest ? 'bg-green text-white' : ''
                        }`}
                      >
                        <div>₹{(lens.price || 0).toLocaleString('en-IN')}</div>
                        {lens.was && lens.was > lens.price && (
                          <div className="text-sm line-through opacity-70">
                            ₹{lens.was.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* BRAND */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Brand</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      {lens.brand}
                    </td>
                  ))}
                </tr>

                {/* MOUNT */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Mount</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      <span className="pill-mount bg-orange-l text-orange px-3 py-1 rounded-full text-sm font-semibold">
                        {lens.mount}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* FOCAL LENGTH */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Focal Length</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      {lens.mm}mm
                    </td>
                  ))}
                </tr>

                {/* MAX APERTURE */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Max Aperture</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center font-semibold">
                      f/{lens.f}
                    </td>
                  ))}
                </tr>

                {/* OIS */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Optical Image Stabilization</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      <span className={`text-2xl ${lens.ois ? 'text-green' : 'text-muted'}`}>
                        {lens.ois ? '✅' : '❌'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* AUTOFOCUS */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Autofocus</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      <span className={`text-2xl ${lens.af ? 'text-green' : 'text-muted'}`}>
                        {lens.af ? '✅' : '❌'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* WEATHER SEALED */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Weather Sealed</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      <span className={`text-2xl ${lens.weather ? 'text-green' : 'text-muted'}`}>
                        {lens.weather ? '✅' : '❌'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* RATING */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Rating</td>
                  {compareLenses.map((lens) => {
                    const maxRating = Math.max(...compareLenses.map(l => l.rating || 0));
                    const isBest = lens.rating === maxRating;
                    return (
                      <td
                        key={lens.id}
                        className={`px-6 py-3 text-center font-bold ${
                          isBest ? 'bg-gold text-brown' : ''
                        }`}
                      >
                        <div className="text-lg">{'⭐'.repeat(Math.floor(lens.rating || 0))}</div>
                        <div className="text-sm">{lens.rating?.toFixed(1)}/5</div>
                      </td>
                    );
                  })}
                </tr>

                {/* REVIEWS COUNT */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Reviews</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      {(lens.reviews || 0).toLocaleString('en-IN')} reviews
                    </td>
                  ))}
                </tr>

                {/* BEST FOR TAGS */}
                <tr className="border-b border-border hover:bg-cream-d transition">
                  <td className="px-6 py-3 font-semibold text-brown">Best For</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-3 text-center">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(lens.bestFor || []).map((tag) => (
                          <span
                            key={tag}
                            className="pill-ois bg-teal-l text-teal px-2 py-1 rounded-full text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* ACTION BUTTONS */}
                <tr>
                  <td className="px-6 py-4 font-semibold text-brown bg-cream-d">Actions</td>
                  {compareLenses.map((lens) => (
                    <td key={lens.id} className="px-6 py-4 text-center bg-cream-d">
                      <div className="flex flex-col gap-2">
                        {lens.amazon ? (
                          <a
                            href={lens.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm"
                          >
                            Buy on Amazon
                          </a>
                        ) : (
                          <span className="btn-primary text-sm opacity-50 cursor-not-allowed">
                            Amazon N/A
                          </span>
                        )}
                        <Link to={`/lens/${lens.id}`} className="btn-secondary text-sm">
                          View Details
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* COMPARISON - MOBILE */}
        <div className="md:hidden space-y-8 mb-12">
          {compareLenses.map((lens) => (
            <div key={lens.id} className="bg-white border-2 border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl mb-2">{lens.emoji || '📷'}</div>
                  <h3 className="text-xl font-bold text-brown">{lens.name}</h3>
                </div>
                <button
                  onClick={() => compare.remove(lens.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Price</span>
                  <span className="font-bold">₹{(lens.price || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Brand</span>
                  <span>{lens.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Mount</span>
                  <span className="pill-mount bg-orange-l text-orange px-3 py-1 rounded-full text-sm font-semibold">
                    {lens.mount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Focal Length</span>
                  <span>{lens.mm}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Max Aperture</span>
                  <span className="font-bold">f/{lens.f}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">OIS</span>
                  <span className="text-2xl">{lens.ois ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Autofocus</span>
                  <span className="text-2xl">{lens.af ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Weather Sealed</span>
                  <span className="text-2xl">{lens.weather ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Rating</span>
                  <span className="font-bold">{lens.rating?.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brown">Reviews</span>
                  <span>{(lens.reviews || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {lens.bestFor && lens.bestFor.length > 0 && (
                <div className="mb-6">
                  <p className="font-semibold text-brown mb-3">Best For</p>
                  <div className="flex flex-wrap gap-2">
                    {lens.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="pill-ois bg-teal-l text-teal px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {lens.amazon ? (
                  <a
                    href={lens.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-center"
                  >
                    Buy on Amazon
                  </a>
                ) : (
                  <span className="btn-primary text-center opacity-50">Amazon N/A</span>
                )}
                <Link to={`/lens/${lens.id}`} className="btn-secondary text-center">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          {compareLenses.length < 3 && (
            <Link to="/lenses" className="btn-primary">
              + Add Another Lens
            </Link>
          )}
          <button
            onClick={() => compare.clear()}
            className="btn-secondary"
          >
            Clear All
          </button>
        </div>

        {/* FOOTER CTA */}
        <div className="bg-brown text-cream rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still deciding?</h2>
          <p className="text-cream-d text-lg mb-6">Take our lens quiz for personalized recommendations based on your style and budget.</p>
          <Link to="/find" className="btn-primary inline-block">
            Start the Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
