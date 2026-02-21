import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompareBar = ({ compareList, onRemove, onClear, onCompare }) => {
  const navigate = useNavigate();
  const isVisible = compareList.length > 0;
  const canCompare = compareList.length >= 2;

  const handleCompare = () => {
    if (canCompare) {
      navigate('/compare', { state: { compareList } });
    }
  };

  return (
    <>
      {/* Fixed Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-brown text-cream px-6 py-4 transition-transform duration-300 ease-in-out z-40 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Side: Compare Label + Slots */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm whitespace-nowrap">
              Compare:
            </span>
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, idx) => {
                const lens = compareList[idx];
                return (
                  <div
                    key={idx}
                    className={`pill rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                      lens
                        ? 'bg-orange-l text-orange border border-orange'
                        : 'bg-transparent border border-dashed border-cream text-cream'
                    }`}
                  >
                    {lens ? (
                      <>
                        <span>{lens.name}</span>
                        <button
                          onClick={() => onRemove?.(lens.id)}
                          className="hover:text-orange transition-colors"
                          aria-label="Remove lens"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs opacity-60">+ Add a lens</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Compare Button + Clear */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={`font-semibold px-6 py-2 rounded transition-all ${
                canCompare
                  ? 'bg-orange text-cream hover:bg-orange-d'
                  : 'bg-muted text-cream cursor-not-allowed opacity-50'
              }`}
            >
              Compare ({compareList.length})
            </button>
            <button
              onClick={onClear}
              className="text-cream hover:bg-brown-l rounded p-2 transition-colors"
              aria-label="Clear all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Page Bottom Padding when bar is visible */}
      {isVisible && <div className="pb-20" />}
    </>
  );
};

export default CompareBar;
