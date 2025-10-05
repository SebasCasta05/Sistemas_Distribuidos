import React from 'react';
import { ChevronDown } from 'lucide-react';

function FilterGroup({ name, icon: Icon, label, options = [], selected = [], onOptionToggle = () => {}, activeFilter, toggleFilter, wide = false, extraWide = false }) {
  const isOpen = activeFilter === name;

  return (
    <div className="filter-group">
      <button
        className={`filter-btn ${selected.length > 0 ? 'has-selection' : ''}`}
        onClick={() => toggleFilter(name)}
        aria-expanded={isOpen}
        aria-controls={`filter-${name}`}
      >
        <Icon size={20} />
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="selection-badge">{selected.length}</span>
        )}
        <ChevronDown size={16} className={`chevron ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <div id={`filter-${name}`} className={`filter-dropdown ${wide ? 'wide' : ''} ${extraWide ? 'extra-wide' : ''}`} role="dialog">
          <div className="dropdown-header">
            <h3>Selecciona {label.toLowerCase()}</h3>
          </div>
          <div className="dropdown-content">
            {options.map(opt => (
              <label key={opt} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => onOptionToggle(opt)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterGroup;

