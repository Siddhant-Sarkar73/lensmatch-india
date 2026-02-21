import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const QuizStep = ({
  question,
  answer,
  onSelect,
  stepNum,
  totalSteps,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  const [expandWhy, setExpandWhy] = useState(false);

  const renderProgressDots = () => {
    return (
      <div className="flex gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all ${
              i < stepNum - 1
                ? 'w-8 bg-orange'
                : i === stepNum - 1
                  ? 'w-8 bg-white border-2 border-orange'
                  : 'w-3 bg-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderOptions = () => {
    // All types now read directly from question.opts using the JSON short-key format:
    // opt.e = emoji, opt.t = title, opt.d = description, opt.v = value

    if (question.type === 'options') {
      return (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {question.opts.map((opt) => (
            <button
              key={opt.v}
              onClick={() => onSelect(opt.v)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                answer === opt.v
                  ? 'border-orange bg-orange-l'
                  : 'border-border hover:border-orange-l'
              }`}
            >
              <div className="text-3xl mb-2">{opt.e}</div>
              <div className="font-semibold text-brown text-sm">{opt.t}</div>
              {opt.d && (
                <div className="text-xs text-muted mt-1">{opt.d}</div>
              )}
            </button>
          ))}
        </div>
      );
    }

    if (question.type === 'budget') {
      return (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {question.opts.map((opt) => (
              <button
                key={opt.v}
                onClick={() => onSelect(opt.v)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  answer === opt.v
                    ? 'border-orange bg-orange-l'
                    : 'border-border hover:border-orange-l'
                }`}
              >
                <div className="text-3xl mb-2">{opt.e}</div>
                <div className="font-semibold text-sm text-brown">{opt.t}</div>
                {opt.d && (
                  <div className="text-xs text-muted mt-1">{opt.d}</div>
                )}
              </button>
            ))}
          </div>
          <div className="bg-cream-d p-4 rounded-lg mb-6">
            <p className="text-sm text-brown">
              💡 Choose based on your budget. Higher-priced lenses offer better
              optics, build quality, and more features.
            </p>
          </div>
        </div>
      );
    }

    if (question.type === 'brand') {
      return (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {question.opts.map((opt) => (
            <button
              key={opt.v}
              onClick={() => onSelect(opt.v)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                answer === opt.v
                  ? 'border-orange bg-orange-l'
                  : 'border-border hover:border-orange-l'
              }`}
            >
              <div className="text-4xl mb-2">{opt.e}</div>
              <div className="font-semibold text-brown text-sm">{opt.t}</div>
              {opt.d && (
                <div className="text-xs text-muted mt-1">{opt.d}</div>
              )}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cream to-cream-d px-4 py-8">
      <div className="card max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Progress Dots */}
        {renderProgressDots()}

        {/* Step Counter */}
        <div className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          Step {stepNum} of {totalSteps}
        </div>

        {/* Question */}
        <h2 className="section-heading text-2xl mb-2">{question.text}</h2>
        {question.sub && (
          <p className="text-muted mb-6">{question.sub}</p>
        )}

        {/* Why expandable */}
        {question.why && (
          <div className="mb-6">
            <button
              onClick={() => setExpandWhy(!expandWhy)}
              className="flex items-center gap-2 text-sm font-semibold text-teal-d hover:text-teal transition-colors"
            >
              Why does this matter?
              {expandWhy ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {expandWhy && (
              <div className="mt-3 p-4 bg-teal-l rounded-lg text-sm text-teal-d border border-teal">
                {question.why}
              </div>
            )}
          </div>
        )}

        {/* Options */}
        {renderOptions()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="px-6 py-2 rounded font-semibold text-brown hover:bg-cream transition-colors"
            >
              ← Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onNext}
            disabled={!answer}
            className={`px-6 py-2 rounded font-semibold transition-all ${
              answer
                ? 'btn-primary hover:bg-orange-d'
                : 'bg-muted text-white cursor-not-allowed opacity-50'
            }`}
          >
            {isLast ? 'See My Matches →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
