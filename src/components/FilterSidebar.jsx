import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSidebar = ({
  filters,
  onChange,
  bodyMount,
  onBodyMountChange,
  onReset,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    bodyMount: true,
    brand: true,
    mount: false,
    focal: false,
    aperture: false,
    budget: false,
    features: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentFilter = filters[filterType] || [];
    const updated = currentFilter.includes(value)
      ? currentFilter.filter((item) => item !== value)
      : [...currentFilter, value];
    onChange({ ...filters, [filterType]: updated });
  };

  const brandOptions = [
    { name: 'Nikon', count: 12 },
    { name: 'Canon', count: 10 },
    { name: 'Sony', count: 9 },
    { name: 'Fujifilm', count: 8 },
    { name: 'Sigma', count: 7 },
    { name: 'Tamron', count: 5 },
    { name: 'Viltrox', count: 2 },
    { name: 'Samyang', count: 3 },
  ];

  const mountOptions = [
    { name: 'F-mount (Nikon DSLR)', value: 'F', count: 14 },
    { name: 'Z-mount (Nikon ML)', value: 'Z', count: 8 },
    { name: 'EF/EF-S (Canon DSLR)', value: 'EF', count: 10 },
    { name: 'RF (Canon ML)', value: 'RF', count: 6 },
    { name: 'E-mount (Sony ML)', value: 'E', count: 10 },
    { name: 'X-mount (Fujifilm ML)', value: 'X', count: 6 },
  ];

  const focalOptions = [
    { name: '35mm', value: '35mm', count: 8 },
    { name: '50mm', value: '50mm', count: 11 },
    { name: '85mm', value: '85mm', count: 12 },
    { name: '100–105mm', value: '100-105mm', count: 6 },
    { name: '135mm', value: '135mm', count: 4 },
    { name: 'Other', value: 'other', count: 5 },
  ];

  const apertureOptions = [
    { name: 'f/1.2', value: 'f/1.2', count: 4 },
    { name: 'f/1.4', value: 'f/1.4', count: 14 },
    { name: 'f/1.8', value: 'f/1.8', count: 16 },
    { name: 'f/2', value: 'f/2', count: 8 },
    { name: 'f/2.8', value: 'f/2.8', count: 6 },
  ];

  const budgetOptions = [
    { name: 'Under ₹15k', value: 'under-15k', count: 6 },
    { name: '₹15k–₹35k', value: '15k-35k', count: 12 },
    { name: '₹35k–₹70k', value: '35k-70k', count: 18 },
    { name: '₹70k–₹1.2L', value: '70k-120k', count: 10 },
    { name: 'Over ₹1.2L', value: 'over-120k', count: 8 },
  ];

  const featureOptions = [
    { name: 'Image Stabilisation', value: 'stabilisation', count: 18 },
    { name: 'Autofocus', value: 'autofocus', count: 46 },
    { name: 'Weather Sealed', value: 'weather-sealed', count: 22 },
    { name: 'APS-C Optimised', value: 'aps-c-optimised', count: 16 },
  ];

  const bodyMountOptions = [
    {
      brand: 'Nikon',
      options: [
        { label: 'F-mount DSLR', value: 'F' },
        { label: 'Z-mount Mirrorless', value: 'Z' },
      ],
    },
    {
      brand: 'Canon',
      options: [
        { label: 'EF/EF-S DSLR', value: 'EF' },
        { label: 'RF Mirrorless', value: 'RF' },
      ],
    },
    {
      brand: 'Sony',
      options: [{ label: 'E-mount Mirrorless', value: 'E' }],
    },
    {
      brand: 'Fujifilm',
      options: [{ label: 'X-mount Mirrorless', value: 'X' }],
    },
  ];

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full font-semibold text-brown hover:text-brown-l transition-colors"
      >
        <span>{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>
      {expandedSections[sectionKey] && <div className="mt-4">{children}</div>}
    </div>
  );

  const CheckboxOption = ({ label, value, filterType, count, isChecked }) => (
    <label className="flex items-center space-x-3 py-2 cursor-pointer group hover:bg-cream rounded px-2 transition-colors">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => handleCheckboxChange(filterType, value)}
        className="w-4 h-4 rounded accent-orange"
      />
      <span className="text-sm text-brown flex-1 group-hover:text-brown-l">{label}</span>
      <span className="text-xs text-muted bg-cream rounded-full px-2 py-1">
        {count}
      </span>
    </label>
  );

  return (
    <aside className="w-64 bg-white rounded-lg shadow p-6 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-heading text-lg">Filters</h2>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-orange hover:text-orange-d transition-colors"
        >
          Reset all
        </button>
      </div>

      <FilterSection title="Works with my body" sectionKey="bodyMount">
        <select
          value={bodyMount}
          onChange={(e) => onBodyMountChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded bg-cream text-brown text-sm focus:outline-none focus:ring-2 focus:ring-orange"
        >
          <option value="">Select a body...</option>
          {bodyMountOptions.map((group) => (
            <optgroup key={group.brand} label={group.brand}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Brand" sectionKey="brand">
        <div className="space-y-2">
          {brandOptions.map((brand) => (
            <CheckboxOption
              key={brand.name}
              label={brand.name}
              value={brand.name}
              filterType="brands"
              count={brand.count}
              isChecked={(filters.brands || []).includes(brand.name)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Mount" sectionKey="mount">
        <div className="space-y-2">
          {mountOptions.map((mount) => (
            <CheckboxOption
              key={mount.value}
              label={mount.name}
              value={mount.value}
              filterType="mounts"
              count={mount.count}
              isChecked={(filters.mounts || []).includes(mount.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Focal Length" sectionKey="focal">
        <div className="space-y-2">
          {focalOptions.map((focal) => (
            <CheckboxOption
              key={focal.value}
              label={focal.name}
              value={focal.value}
              filterType="focals"
              count={focal.count}
              isChecked={(filters.focals || []).includes(focal.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Max Aperture" sectionKey="aperture">
        <div className="space-y-2">
          {apertureOptions.map((aperture) => (
            <CheckboxOption
              key={aperture.value}
              label={aperture.name}
              value={aperture.value}
              filterType="apertures"
              count={aperture.count}
              isChecked={(filters.apertures || []).includes(aperture.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Budget" sectionKey="budget">
        <div className="space-y-2">
          {budgetOptions.map((budget) => (
            <CheckboxOption
              key={budget.value}
              label={budget.name}
              value={budget.value}
              filterType="priceRanges"
              count={budget.count}
              isChecked={(filters.priceRanges || []).includes(budget.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Features" sectionKey="features">
        <div className="space-y-2">
          {featureOptions.map((feature) => (
            <CheckboxOption
              key={feature.value}
              label={feature.name}
              value={feature.value}
              filterType="features"
              count={feature.count}
              isChecked={(filters.features || []).includes(feature.value)}
            />
          ))}
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;
