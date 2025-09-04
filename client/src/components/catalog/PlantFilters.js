import React, { useState } from 'react';

const PlantFilters = ({ filters, categories, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm });
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const filterOptions = {
    type: [
      { value: 'plant', label: 'Plants' },
      { value: 'seed', label: 'Seeds' },
      { value: 'tool', label: 'Tools' },
      { value: 'fertilizer', label: 'Fertilizers' },
      { value: 'accessory', label: 'Accessories' }
    ],
    difficulty: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'expert', label: 'Expert' }
    ],
    sunlight: [
      { value: 'low', label: 'Low Light' },
      { value: 'medium', label: 'Medium Light' },
      { value: 'high', label: 'High Light' },
      { value: 'direct', label: 'Direct Sun' },
      { value: 'indirect', label: 'Indirect Sun' }
    ],
    water: [
      { value: 'low', label: 'Low Water' },
      { value: 'medium', label: 'Medium Water' },
      { value: 'high', label: 'High Water' },
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'bi-weekly', label: 'Bi-weekly' },
      { value: 'monthly', label: 'Monthly' }
    ]
  };

  const FilterSection = ({ title, options, filterKey, currentValue }) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            name={filterKey}
            value=""
            checked={!currentValue}
            onChange={() => handleFilterChange(filterKey, '')}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">All</span>
        </label>
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name={filterKey}
              value={option.value}
              checked={currentValue === option.value}
              onChange={() => handleFilterChange(filterKey, option.value)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <form onSubmit={handleSearchSubmit}>
          <label htmlFor="search" className="block text-sm font-medium text-gray-900 mb-2">
            Search
          </label>
          <div className="flex">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search plants..."
              className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-green-500 focus:border-green-500 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Featured Toggle */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.featured === 'true'}
            onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm font-medium text-gray-900">Featured Only</span>
        </label>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => handleFilterChange('category', '')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category._id}
                    checked={filters.category === category._id}
                    onChange={() => handleFilterChange('category', category._id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {category._id}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {category.count}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Type */}
      <FilterSection
        title="Type"
        options={filterOptions.type}
        filterKey="type"
        currentValue={filters.type}
      />

      {/* Difficulty */}
      <FilterSection
        title="Difficulty Level"
        options={filterOptions.difficulty}
        filterKey="difficulty"
        currentValue={filters.difficulty}
      />

      {/* Sunlight Requirements */}
      <FilterSection
        title="Sunlight Requirements"
        options={filterOptions.sunlight}
        filterKey="sunlight"
        currentValue={filters.sunlight}
      />

      {/* Water Requirements */}
      <FilterSection
        title="Water Requirements"
        options={filterOptions.water}
        filterKey="water"
        currentValue={filters.water}
      />
    </div>
  );
};

export default PlantFilters;
