import React from 'react';

const CareInstructions = ({ careInstructions }) => {
  if (!careInstructions) return null;

  const careItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Sunlight',
      value: careInstructions.sunlight,
      color: 'text-yellow-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415zM10 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Water',
      value: careInstructions.water,
      color: 'text-blue-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
      label: 'Soil Type',
      value: careInstructions.soilType,
      color: 'text-amber-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: 'Humidity',
      value: careInstructions.humidity,
      color: 'text-cyan-600'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Care Instructions</h2>
      
      {/* Care Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {careItems.map((item, index) => (
          item.value && (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 ${item.color} mb-3`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{item.label}</h3>
              <p className="text-sm text-gray-600 capitalize">{item.value.replace('-', ' ')}</p>
            </div>
          )
        ))}
      </div>

      {/* Temperature Range */}
      {careInstructions.temperature && (careInstructions.temperature.min || careInstructions.temperature.max) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Temperature Range</h3>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">
              {careInstructions.temperature.min && `${careInstructions.temperature.min}°`}
              {careInstructions.temperature.min && careInstructions.temperature.max && ' - '}
              {careInstructions.temperature.max && `${careInstructions.temperature.max}°`}
              {' '}
              {careInstructions.temperature.unit === 'fahrenheit' ? 'F' : 'C'}
            </span>
          </div>
        </div>
      )}

      {/* Fertilizer Information */}
      {careInstructions.fertilizer && (careInstructions.fertilizer.frequency || careInstructions.fertilizer.type) && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Fertilizer</h3>
          <div className="space-y-2">
            {careInstructions.fertilizer.frequency && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>Frequency:</strong> {careInstructions.fertilizer.frequency.replace('-', ' ')}
                </span>
              </div>
            )}
            {careInstructions.fertilizer.type && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                <span className="text-gray-700">
                  <strong>Type:</strong> {careInstructions.fertilizer.type}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareInstructions;
