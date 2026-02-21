import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LENSES from '../data/lenses.json';
import VENDORS from '../data/vendors.json';

const CITIES = [
  { key: 'bangalore', name: 'Bangalore', emoji: '🏙️', count: VENDORS.bangalore?.length || 0 },
  { key: 'hyderabad', name: 'Hyderabad', emoji: '🏢', count: VENDORS.hyderabad?.length || 0 },
  { key: 'pune', name: 'Pune', emoji: '🌆', count: VENDORS.pune?.length || 0 },
  { key: 'mumbai', name: 'Mumbai', emoji: '🌊', count: VENDORS.mumbai?.length || 0 },
];

const TIPS = [
  {
    title: 'Check for fungus',
    description: 'Inspect the lens glass in bright light for internal fungus or dust. Do not rent if present.',
    emoji: '🔍'
  },
  {
    title: 'Test AF before rental ends',
    description: 'Verify autofocus works smoothly. Slow or hunted AF on return can void warranty claims.',
    emoji: '⚡'
  },
  {
    title: 'Shoot 20 test frames immediately',
    description: 'Test sharpness, aperture blades, and focus accuracy right when you pick it up.',
    emoji: '📸'
  },
  {
    title: 'Inspect glass in bright light',
    description: 'Shine a torch through the lens from multiple angles to spot scratches or coatings issues.',
    emoji: '💡'
  },
  {
    title: 'Document existing scratches',
    description: 'Take photos of any marks or damage before rental starts to avoid deposit disputes.',
    emoji: '📋'
  },
  {
    title: 'Understand deposit terms',
    description: 'Know what constitutes "acceptable wear" vs damage. Ask before you rent.',
    emoji: '💰'
  },
];

export default function Rent() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLens, setSelectedLens] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [journeyStep, setJourneyStep] = useState(0);

  const filteredLenses = useMemo(() => {
    return LENSES.filter(lens =>
      lens.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lens.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 12);
  }, [searchQuery]);

  const vendors = selectedCity ? VENDORS[selectedCity] || [] : [];
  const sortedVendors = [...vendors].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const handleCitySelect = (cityKey) => {
    setSelectedCity(cityKey);
    setJourneyStep(1);
  };

  const handleLensSelect = (lens) => {
    setSelectedLens(lens);
    setJourneyStep(2);
  };

  const goToStep = (stepNum) => {
    if (stepNum === 0) {
      setSelectedCity(null);
      setSelectedLens(null);
      setJourneyStep(0);
    } else if (stepNum === 1 && selectedCity) {
      setSelectedLens(null);
      setJourneyStep(1);
    } else if (stepNum === 2 && selectedLens) {
      setJourneyStep(2);
    } else if (stepNum === 3) {
      setJourneyStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-teal-l">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal to-teal-d text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Try Before You Buy</h1>
          <p className="text-xl text-teal-l max-w-2xl mx-auto mb-12">
            Rent high-end lenses in your city to test before committing thousands of rupees. Perfect for wedding shoots, events, or learning new gear.
          </p>

          {/* City Stats */}
          <div className="grid grid-cols-4 gap-4">
            {CITIES.map(city => (
              <div key={city.key} className="bg-teal-d/30 backdrop-blur rounded-lg p-4">
                <div className="text-3xl mb-2">{city.emoji}</div>
                <p className="font-bold text-sm">{city.count} vendors</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Journey Steps Bar */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
          {[
            { num: 0, label: 'Choose City' },
            { num: 1, label: 'Pick a Lens' },
            { num: 2, label: 'Find Vendors' },
            { num: 3, label: 'Tips' },
          ].map(step => (
            <button
              key={step.num}
              onClick={() => goToStep(step.num)}
              disabled={
                (step.num === 1 && !selectedCity) ||
                (step.num === 2 && !selectedLens)
              }
              className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${
                journeyStep === step.num
                  ? 'bg-teal text-white'
                  : 'bg-white text-teal-d border-2 border-teal disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {step.num + 1}. {step.label}
            </button>
          ))}
        </div>

        {/* STEP 1 - City Selector */}
        {journeyStep === 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-teal-d mb-8">Where do you need a lens?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CITIES.map(city => (
                <button
                  key={city.key}
                  onClick={() => handleCitySelect(city.key)}
                  className="card w-full p-6 text-center flex flex-col items-center hover:shadow-card-lg transition-shadow bg-white border-2 border-transparent hover:border-teal cursor-pointer"
                >
                  <div className="text-5xl mb-3">{city.emoji}</div>
                  <h3 className="text-lg font-bold text-teal-d mb-1">{city.name}</h3>
                  <p className="text-sm text-muted">{city.count} vendors available</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 - Lens Picker */}
        {journeyStep >= 1 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-teal-d mb-6">
              Pick a lens to rent {selectedCity && `in ${CITIES.find(c => c.key === selectedCity)?.name}`}
            </h2>

            <div className="mb-8">
              <input
                type="text"
                placeholder="Search by brand or lens name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-teal rounded-lg focus:outline-none focus:border-teal-d"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLenses.map(lens => (
                <button
                  key={lens.id}
                  onClick={() => handleLensSelect(lens)}
                  className={`card transition-all ${
                    selectedLens?.id === lens.id
                      ? 'border-2 border-teal bg-teal-l'
                      : 'hover:border-teal'
                  }`}
                >
                  <div className="text-4xl mb-2">{lens.emoji}</div>
                  <h3 className="font-bold text-sm text-teal-d mb-1 truncate">{lens.name}</h3>
                  <p className="text-xs text-muted">₹{(lens.rentalPrice || lens.price / 10) / 1000}k/day</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 - Vendor Listings */}
        {journeyStep >= 2 && selectedLens && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-teal-d mb-8">
              {selectedLens.name} available at:
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {sortedVendors.map(vendor => (
                <div
                  key={vendor.id}
                  className={`card ${vendor.featured ? 'border-2 border-gold bg-gold/10' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {vendor.featured && (
                          <span className="pill bg-gold text-brown text-xs font-bold">
                            ⭐ RECOMMENDED
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-teal-d">{vendor.name}</h3>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="pill bg-teal-l text-teal text-xs">{vendor.type}</span>
                        {vendor.delivery && (
                          <span className="pill bg-green text-white text-xs">✓ Delivery</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange">₹{vendor.pricePerDay}</p>
                      <p className="text-xs text-muted">/day</p>
                      {vendor.rating && (
                        <p className="text-sm font-bold text-teal-d mt-2">
                          {'⭐'.repeat(Math.floor(vendor.rating))}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-brown mb-3">{vendor.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted font-medium">Deposit</p>
                      <p className="text-teal-d font-bold">₹{vendor.deposit}</p>
                    </div>
                    <div>
                      <p className="text-muted font-medium">Available Lenses</p>
                      <p className="text-teal-d font-bold">{vendor.lenses || '5+'}</p>
                    </div>
                  </div>

                  <a
                    href={vendor.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-teal w-full"
                  >
                    Contact & View Available Dates
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 - Rental Tips */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-d mb-8">Rental Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIPS.map((tip, i) => (
              <div key={i} className="card bg-white">
                <div className="text-4xl mb-3">{tip.emoji}</div>
                <h3 className="font-bold text-teal-d mb-2">{tip.title}</h3>
                <p className="text-sm text-muted">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buy CTA */}
        <div className="bg-gradient-to-r from-orange to-orange-d text-white rounded-lg p-8 text-center mb-12">
          <h3 className="text-2xl font-bold mb-3">Ready to buy instead?</h3>
          <p className="mb-6">Compare prices and find your perfect lens</p>
          <Link to="/find" className="btn-primary inline-block">
            Find Your Lens →
          </Link>
        </div>
      </div>
    </div>
  );
}
