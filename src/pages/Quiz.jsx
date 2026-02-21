import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import QuizStep from '../components/QuizStep';
import QUESTIONS from '../data/questions.json';
import LENSES from '../data/lenses.json';

const computeResults = (answers) => {
  const scored = LENSES.map(lens => {
    let score = 0;

    // Budget match
    const budget = answers.budget;
    if (budget === 'under15' && lens.price < 15000) score += 5;
    else if (budget === '15to35' && lens.price < 35000) score += 5;
    else if (budget === '35to70' && lens.price < 70000) score += 5;
    else if (budget === 'over70') score += 5;

    // Brand match
    const brand = answers.brand;
    if (brand === 'nikon' && ['F', 'Z'].includes(lens.mount)) score += 20;
    else if (brand === 'canon' && ['EF', 'RF'].includes(lens.mount)) score += 20;
    else if (brand === 'sony' && lens.mount === 'E') score += 20;
    else if (brand === 'fujifilm' && lens.mount === 'X') score += 20;
    else if (brand === 'any') score += 10;

    // OIS match
    if (answers.ois === 'yes' && lens.ois) score += 10;

    // AF match
    if (answers.af === 'critical' && lens.af) score += 10;
    else if (answers.af === 'dontmind' && !lens.af) score += 5;

    // Subject match — use lens.mm (correct field name)
    const subject = answers.subject;
    if ((subject === 'wedding' || subject === 'family') && [85, 105].includes(lens.mm)) score += 5;
    else if (subject === 'studio' && [85, 105].includes(lens.mm)) score += 5;
    else if (subject === 'street' && [35, 50].includes(lens.mm)) score += 5;

    return { lens, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const topThree = sorted.slice(0, 3);

  return topThree.map(item => ({
    ...item.lens,
    matchScore: Math.min(95, Math.round((item.score / 50) * 100))
  }));
};

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (answers.start === 'rent') {
      const timer = setTimeout(() => navigate('/rent'), 600);
      return () => clearTimeout(timer);
    }
    if (answers.start === 'learn') {
      const timer = setTimeout(() => navigate('/learn'), 600);
      return () => clearTimeout(timer);
    }
  }, [answers.start, navigate]);

  const currentQuestion = QUESTIONS[step];

  const handleSelect = (val) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: val
    }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const computedResults = computeResults(answers);
      setResults(computedResults);
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRetake = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Progress Bar */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-orange transition-all duration-300"
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {!showResults ? (
          <QuizStep
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onSelect={handleSelect}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={step === 0}
            isLast={step === QUESTIONS.length - 1}
            stepNum={step + 1}
            totalSteps={QUESTIONS.length}
          />
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-brown mb-2">Your Top Matches</h1>
            <p className="text-muted mb-10">Based on your answers — sorted by how well they fit you</p>

            <div className="grid grid-cols-1 gap-6 mb-10">
              {results.map((lens) => (
                <div key={lens.id} className="card p-6 text-left">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted mb-1">{lens.brand}</p>
                      <h2 className="text-xl font-bold text-brown">{lens.name}</h2>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-3xl font-black text-orange">{lens.matchScore}%</p>
                      <p className="text-xs text-muted">match</p>
                    </div>
                  </div>

                  {/* Match Bar */}
                  <div className="w-full bg-border rounded-full h-2 mb-4">
                    <div
                      className="bg-orange h-full rounded-full transition-all duration-700"
                      style={{ width: `${lens.matchScore}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="pill pill-mount">{lens.mount}-mount</span>
                    <span className="pill">{lens.mm}mm f/{lens.f}</span>
                    {lens.ois && <span className="pill pill-ois">OIS</span>}
                    <span className="pill bg-gold-l text-brown font-bold">
                      ₹{(lens.price / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {/* Fixed: use Link + correct route /lens/:id */}
                    <Link
                      to={`/lens/${lens.id}`}
                      className="btn-primary flex-1 text-center text-sm"
                    >
                      View Details →
                    </Link>
                    {/* Fixed: use lens.amazon not lens.amazonUrl */}
                    {lens.amazon && (
                      <a
                        href={lens.amazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex-1 text-center text-sm"
                      >
                        Buy on Amazon
                      </a>
                    )}
                    {/* Fixed: use Link not plain href */}
                    <Link
                      to="/rent"
                      className="btn-teal flex-1 text-center text-sm"
                    >
                      Rent First
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRetake}
              className="text-teal hover:text-teal-d underline font-semibold"
            >
              ← Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
