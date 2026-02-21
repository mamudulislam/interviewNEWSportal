import { useState, useEffect } from 'react';

function FilterSidebar({ filters, setFilters, filterOptions }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    setFilters(updated);
  };

  const handleCategoryToggle = (category) => {
    const current = localFilters.category || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    handleChange('category', updated);
  };

  const clearFilters = () => {
    setLocalFilters({});
    setFilters({});
  };

  const hasFilters = Object.values(localFilters).some(v => 
    v && (Array.isArray(v) ? v.length > 0 : true)
  );

  const categories = filterOptions.categories?.length > 0 
    ? filterOptions.categories 
    : ['business', 'top', 'technology', 'sports', 'breaking', 'entertainment', 'lifestyle'];
  
  const contentTypes = filterOptions.contentTypes?.length > 0 
    ? filterOptions.contentTypes 
    : ['news'];

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="clear-btn">
            Clear All
          </button>
        )}
      </div>

      <div className="filter-section">
        <label>Date Range</label>
        <div className="date-inputs">
          <input
            type="date"
            value={localFilters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={localFilters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="filter-section">
        <label>Author / Creator</label>
        <select
          value={localFilters.author || ''}
          onChange={(e) => handleChange('author', e.target.value)}
        >
          <option value="">All Authors</option>
          {filterOptions.creators?.map(creator => (
            <option key={creator} value={creator}>{creator}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Language</label>
        <select
          value={localFilters.language || ''}
          onChange={(e) => handleChange('language', e.target.value)}
        >
          <option value="">All Languages</option>
          {filterOptions.languages?.map(lang => (
            <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Country</label>
        <select
          value={localFilters.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
        >
          <option value="">All Countries</option>
          {filterOptions.countries?.map(country => (
            <option key={country} value={country}>{country.charAt(0).toUpperCase() + country.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Category</label>
        <div className="category-grid">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${(localFilters.category || []).includes(cat) ? 'active' : ''}`}
              onClick={() => handleCategoryToggle(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>Content Type</label>
        <select
          value={localFilters.content_type || ''}
          onChange={(e) => handleChange('content_type', e.target.value)}
        >
          <option value="">All Types</option>
          {contentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default FilterSidebar;
