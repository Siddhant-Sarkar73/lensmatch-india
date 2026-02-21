import { Link } from 'react-router-dom';
import LensCard from '../components/LensCard';
import LENSES from '../data/lenses.json';

export default function Home() {
  const featuredLenses = LENSES.slice(0, 6);

  return (
    <div className="font-nunito bg-cream text-gray-800">
      {/* HERO SECTION */}
      <div className="bg-cream-d py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-brown mb-4">
                Find Your Perfect Portrait Lens in India
              </h1>
              <p className="text-lg text-muted mb-8 leading-relaxed">
                Stop spending hours on Google. We've researched every portrait lens available in India — all brands, real prices, honest reviews.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 mb-8">
                <Link to="/find" className="btn-primary">
                  Take the Quiz →
                </Link>
                <Link to="/lenses" className="btn-secondary">
                  Browse All Lenses
                </Link>
                <Link to="/rent" className="text-teal font-semibold hover:text-teal-d transition">
                  Rent First
                </Link>
              </div>
            </div>

            {/* Right: Journey Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange rounded-lg p-6 text-white">
                <div className="text-3xl mb-3">🛍️</div>
                <h3 className="font-bold text-lg">Find & Buy</h3>
                <p className="text-sm text-orange-l mt-2">Discover and purchase your lens</p>
              </div>
              <div className="bg-teal rounded-lg p-6 text-white">
                <div className="text-3xl mb-3">🎬</div>
                <h3 className="font-bold text-lg">Try & Rent</h3>
                <p className="text-sm text-teal-l mt-2">Rent before you buy</p>
              </div>
              <div className="bg-blue rounded-lg p-6 text-white">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-bold text-lg">Learn First</h3>
                <p className="text-sm text-blue-l mt-2">Education and guides</p>
              </div>
              <div className="bg-cream-d rounded-lg p-6 text-brown">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="font-bold text-lg">Compare</h3>
                <p className="text-sm text-gray-600 mt-2">Side-by-side comparison</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="bg-brown text-cream py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold">50+</div>
              <p className="text-cream-d text-sm mt-2">Lenses Researched</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">8</div>
              <p className="text-cream-d text-sm mt-2">Major Brands</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">6</div>
              <p className="text-cream-d text-sm mt-2">Mount Types</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">4</div>
              <p className="text-cream-d text-sm mt-2">Rental Cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="section-heading text-brown mb-4">How It Works</h2>
          <p className="section-sub text-muted mb-16">Three simple steps to find your perfect lens</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-brown mb-3">Answer 8 Questions</h3>
              <p className="text-muted">Tell us about your shooting style, budget, and camera system</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-brown mb-3">Get Matched Lenses</h3>
              <p className="text-muted">See personalized recommendations with compatibility scores</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-brown mb-3">Compare & Buy</h3>
              <p className="text-muted">Compare prices, read reviews, and purchase or rent today</p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED LENSES */}
      <div className="py-16 md:py-24 bg-cream-d">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="section-heading text-brown mb-4">Featured Portrait Lenses</h2>
          <p className="section-sub text-muted mb-12">Curated selections from our database</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLenses.map((lens) => (
              <LensCard
                key={lens.id}
                lens={lens}
                layout="grid"
                onCompare={() => {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* JOURNEY SECTION */}
      <div className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="section-heading text-brown mb-4">Your Lens Journey</h2>
          <p className="section-sub text-muted mb-12">Choose your path to the perfect lens</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buy Journey */}
            <div className="card bg-orange text-white rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Find & Buy</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-orange font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    1
                  </span>
                  <span>Take our lens quiz</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-orange font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    2
                  </span>
                  <span>Get personalized results</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-orange font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    3
                  </span>
                  <span>Compare prices across vendors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-orange font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    4
                  </span>
                  <span>Buy with confidence</span>
                </li>
              </ul>
            </div>

            {/* Rent Journey */}
            <div className="card bg-teal text-white rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Try Before You Buy</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-teal font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    1
                  </span>
                  <span>Select your city</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-teal font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    2
                  </span>
                  <span>View rental vendors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-teal font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    3
                  </span>
                  <span>Read rental guidelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-teal font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    4
                  </span>
                  <span>Test before committing</span>
                </li>
              </ul>
            </div>

            {/* Learn Journey */}
            <div className="card bg-blue text-white rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Build Your Knowledge</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-blue font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    1
                  </span>
                  <span>Read expert guides</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-blue font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    2
                  </span>
                  <span>Learn lens terminology</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-blue font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    3
                  </span>
                  <span>Understand mounts & formats</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="pill bg-white text-blue font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    4
                  </span>
                  <span>Make informed decisions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* EDUCATION TEASER */}
      <div className="py-16 md:py-24 bg-cream-d">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="section-heading text-brown mb-4">Learn More</h2>
          <p className="section-sub text-muted mb-12">Deepen your lens knowledge</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/learn" className="card bg-white border-2 border-border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-brown mb-2">Understanding Aperture & Bokeh</h3>
              <p className="text-muted mb-4">Master the fundamentals of lens aperture and how it affects your portraits</p>
              <span className="text-orange font-semibold">Read More →</span>
            </Link>

            <Link to="/learn" className="card bg-white border-2 border-border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-brown mb-2">Which Mount Should You Choose?</h3>
              <p className="text-muted mb-4">A comprehensive guide to camera mounts and lens compatibility</p>
              <span className="text-orange font-semibold">Read More →</span>
            </Link>

            <Link to="/learn" className="card bg-white border-2 border-border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🇮🇳</div>
              <h3 className="text-xl font-bold text-brown mb-2">Buying Lenses in India: Grey Market vs Official</h3>
              <p className="text-muted mb-4">Navigate pricing, warranty, and authenticity when buying lenses in India</p>
              <span className="text-orange font-semibold">Read More →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* BIG CTA SECTION */}
      <div className="bg-brown py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-6">
            Ready to find your perfect lens?
          </h2>
          <p className="text-cream-d text-lg mb-10 max-w-2xl mx-auto">
            Our quiz takes just 3 minutes and matches you with lenses suited to your style and budget.
          </p>
          <Link to="/find" className="btn-primary inline-block">
            Start the Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
