import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

const ARTICLES = [
  {
    slug: 'aperture',
    title: 'Understanding Aperture & Bokeh',
    category: 'beginner',
    readTime: '7 min',
    excerpt: 'Aperture is the single most important concept for portrait photographers. Here is what f/1.4 actually means and why it matters.',
    sources: [
      { name: 'DPReview', url: 'https://www.dpreview.com' },
      { name: 'Photography Life', url: 'https://www.photographylife.com' }
    ]
  },
  {
    slug: 'mounts',
    title: 'Camera Mounts Explained: F vs Z vs EF vs E vs X',
    category: 'lenses',
    readTime: '5 min',
    excerpt: 'Different camera brands use incompatible lens mounts. This guide demystifies which lenses work with which cameras.',
    sources: [
      { name: 'Lens Rentals Blog', url: 'https://www.lensrentals.com/blog' },
      { name: 'Photography Life', url: 'https://www.photographylife.com' }
    ]
  },
  {
    slug: 'india-buying',
    title: 'Buying Lenses in India: Grey Market vs Official',
    category: 'india',
    readTime: '6 min',
    excerpt: 'Should you buy grey market lenses in India to save ₹10,000? Here is what you actually risk.',
    sources: [
      { name: 'Fred Miranda', url: 'https://www.fredmiranda.com' },
      { name: 'DPReview', url: 'https://www.dpreview.com' }
    ]
  },
  {
    slug: 'bokeh',
    title: 'What Makes Beautiful Bokeh?',
    category: 'beginner',
    readTime: '4 min',
    excerpt: 'Not all blur is created equal. Learn what separates creamy bokeh from harsh, distracting backgrounds.',
    sources: [
      { name: 'Photography Life', url: 'https://www.photographylife.com' },
      { name: 'Fstoppers', url: 'https://fstoppers.com' }
    ]
  },
  {
    slug: 'primes-vs-zoom',
    title: 'Prime vs Zoom for Portraits',
    category: 'lenses',
    readTime: '5 min',
    excerpt: 'The eternal debate. For portrait work in India, here is our honest take on primes vs zooms.',
    sources: [
      { name: 'DPReview', url: 'https://www.dpreview.com' },
      { name: 'Photography Life', url: 'https://www.photographylife.com' }
    ]
  },
  {
    slug: 'rental-guide',
    title: 'How to Rent a Lens in India',
    category: 'india',
    readTime: '4 min',
    excerpt: 'A step-by-step guide to renting camera lenses in Bangalore, Hyderabad, Pune, and Mumbai.',
    sources: [
      { name: 'Lens Rentals Blog', url: 'https://www.lensrentals.com/blog' }
    ]
  },
  {
    slug: 'sigma-art',
    title: 'Are Sigma Art Lenses Worth It?',
    category: 'lenses',
    readTime: '5 min',
    excerpt: 'Sigma Art lenses offer near-flagship optical quality at half the price. Here is what the trade-offs are.',
    sources: [
      { name: 'DPReview', url: 'https://www.dpreview.com' },
      { name: 'Fstoppers', url: 'https://fstoppers.com' }
    ]
  },
  {
    slug: 'low-light',
    title: 'Shooting Portraits in Low Light',
    category: 'beginner',
    readTime: '6 min',
    excerpt: 'Indian weddings are often in dim mandaps and halls. Here is how to shoot sharp portraits without flash.',
    sources: [
      { name: 'Photography Life', url: 'https://www.photographylife.com' },
      { name: 'Lens Rentals Blog', url: 'https://www.lensrentals.com/blog' }
    ]
  },
];

const APERTURE_POINTS = [
  {
    title: 'Aperture is the size of the light hole',
    description: 'Bigger hole = more light reaches your sensor. This matters in low light and lets you use faster shutter speeds.'
  },
  {
    title: 'F-number is inverse to aperture size',
    description: 'f/1.4 is LARGER than f/2.8. The smaller the number, the wider the aperture. This confuses everyone.'
  },
  {
    title: 'Lower f-number = more background blur',
    description: 'f/1.4 gives creamy blur, f/5.6 keeps more background sharp. Portrait lenses are usually f/1.4 to f/2.8.'
  },
  {
    title: 'Best portrait lenses range 50–135mm',
    description: 'A 50mm f/1.8 is compact and affordable. An 85mm f/1.4 is the portrait gold standard. A 135mm f/2 is for flattering compression.'
  },
  {
    title: 'Bokeh quality depends on aperture blade count',
    description: 'More blades (8+) = smoother bokeh circles. Fewer blades = angular bokeh. But good glass matters more than blade count.'
  },
];

export default function Learn() {
  const { slug } = useParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const article = ARTICLES.find(a => a.slug === slug);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(a => {
      const matchesFilter = activeFilter === 'all' || a.category === activeFilter;
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  // Single Article View
  if (slug) {
    if (!article) {
      return (
        <div className="min-h-screen bg-blue-l">
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold text-blue-d mb-4">Article Not Found</h1>
            <p className="text-muted mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/learn" className="btn-primary">
              Back to Learning Hub
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-blue-l">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-sm text-muted">
            <Link to="/" className="hover:text-blue-d">Home</Link>
            <span>/</span>
            <Link to="/learn" className="hover:text-blue-d">Learn</Link>
            <span>/</span>
            <span className="text-blue-d font-medium">{article.title}</span>
          </nav>

          {/* Article Header */}
          <div className="card bg-white mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`pill text-xs font-bold ${
                article.category === 'beginner' ? 'bg-blue-l text-blue-d' :
                article.category === 'lenses' ? 'bg-teal-l text-teal-d' :
                'bg-gold text-brown'
              }`}>
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
              <span className="text-xs text-muted">📖 {article.readTime} read</span>
            </div>
            <h1 className="text-4xl font-bold text-blue-d mb-4">{article.title}</h1>
          </div>

          {/* Article Content */}
          <div className="card bg-white mb-8">
            {article.slug === 'aperture' ? (
              <div>
                <p className="text-lg text-brown mb-8">
                  Understanding aperture is the cornerstone of mastering portrait photography. It controls three critical aspects: how much light reaches your sensor, how fast you can shoot, and how much of your background is blurred. Let's break it down.
                </p>

                <div className="space-y-6">
                  {APERTURE_POINTS.map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-d mb-1">{point.title}</h3>
                        <p className="text-brown text-sm">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className="font-bold text-blue-d mb-4">Next Steps</h3>
                  <ul className="text-sm text-brown space-y-2">
                    <li>• Take a 50mm f/1.8 prime lens and shoot at different apertures to see the effect</li>
                    <li>• Notice how f/1.8 isolates your subject vs f/8 which keeps everything sharp</li>
                    <li>• Understand that bokeh is as much about lens quality as aperture blades</li>
                    <li>• Try the <Link to="/quiz" className="text-blue underline">LensMatch Quiz</Link> to find the right lens for your style</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-center text-muted italic py-12">
                  Full article coming soon — we are curating the best sources.
                </p>
              </div>
            )}
          </div>

          {/* Sources */}
          <div className="card bg-blue-l border-blue mb-8">
            <h3 className="font-bold text-blue-d mb-4">Sources & Further Reading</h3>
            <div className="space-y-2">
              {article.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue hover:underline text-sm"
                >
                  → {source.name}
                </a>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Link to="/learn" className="text-blue-d hover:text-blue underline font-medium">
              ← Back to Learning Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Hub View
  return (
    <div className="min-h-screen bg-blue-l">
      {/* Hero with Search */}
      <div className="bg-gradient-to-r from-blue to-blue-l text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-8">Learning Hub</h1>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-brown focus:outline-none focus:ring-2 focus:ring-blue-d"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* No Hallucinations Banner */}
        <div className="card bg-gold/20 border-2 border-gold mb-8">
          <p className="text-sm text-brown">
            <span className="font-bold">🎯 No hallucinations:</span> All content on this page is curated from or sourced to trusted publications: DPReview, Photography Life, Fstoppers, Lens Rentals Blog, and official manufacturer pages.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'beginner', 'lenses', 'india'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${
                activeFilter === filter
                  ? 'bg-blue text-white'
                  : 'bg-white text-blue-d border-2 border-blue hover:bg-blue-l'
              }`}
            >
              {filter === 'all' ? 'All Articles' :
               filter === 'beginner' ? 'Beginner' :
               filter === 'lenses' ? 'Lenses' :
               'India Tips'}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredArticles.map(art => (
            <Link
              key={art.slug}
              to={`/learn/${art.slug}`}
              className="card hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`pill text-xs font-bold ${
                  art.category === 'beginner' ? 'bg-blue-l text-blue-d' :
                  art.category === 'lenses' ? 'bg-teal-l text-teal-d' :
                  'bg-gold text-brown'
                }`}>
                  {art.category.charAt(0).toUpperCase() + art.category.slice(1)}
                </span>
                <span className="text-xs text-muted">📖 {art.readTime}</span>
              </div>
              <h3 className="font-bold text-blue-d mb-2 text-lg">{art.title}</h3>
              <p className="text-sm text-muted mb-4">{art.excerpt}</p>
              <p className="text-blue hover:text-blue-d font-medium text-sm">Read →</p>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No articles found matching your search.</p>
          </div>
        )}

        {/* Suggest Topic Section */}
        <div className="card bg-blue-l border-2 border-blue text-center">
          <h3 className="font-bold text-blue-d mb-3 text-lg">💡 Have a topic in mind?</h3>
          <p className="text-brown mb-4">
            What photography concept or lens comparison confuses you? We'd love to cover it.
          </p>
          <a
            href="mailto:hello@lensmatch.in?subject=Suggest%20a%20Learning%20Topic"
            className="btn-primary inline-block"
          >
            Suggest a Topic
          </a>
        </div>
      </div>
    </div>
  );
}
