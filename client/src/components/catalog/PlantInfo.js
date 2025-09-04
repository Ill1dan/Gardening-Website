import React, { useState } from 'react';

const PlantInfo = ({ plant }) => {
  const [activeTab, setActiveTab] = useState('growth');

  const tabs = [
    { id: 'growth', label: 'Growth Info', icon: '🌱' },
    { id: 'planting', label: 'Planting', icon: '🌿' },
    { id: 'problems', label: 'Common Issues', icon: '🐛' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Plant Information</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'growth' && (
          <div className="space-y-6">
            {/* Growth Rate */}
            {plant.growthInfo?.growthRate && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Rate</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  plant.growthInfo.growthRate === 'fast' ? 'bg-green-100 text-green-800' :
                  plant.growthInfo.growthRate === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {plant.growthInfo.growthRate}
                </span>
              </div>
            )}

            {/* Mature Size */}
            {plant.growthInfo?.matureSize && (plant.growthInfo.matureSize.height || plant.growthInfo.matureSize.width) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mature Size</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {plant.growthInfo.matureSize.height && (
                    <p className="text-gray-700">
                      <strong>Height:</strong> {plant.growthInfo.matureSize.height.value} {plant.growthInfo.matureSize.height.unit}
                    </p>
                  )}
                  {plant.growthInfo.matureSize.width && (
                    <p className="text-gray-700">
                      <strong>Width:</strong> {plant.growthInfo.matureSize.width.value} {plant.growthInfo.matureSize.width.unit}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bloom/Harvest Time */}
            {(plant.growthInfo?.bloomTime || plant.growthInfo?.harvestTime) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Timing</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {plant.growthInfo.bloomTime && (
                    <p className="text-gray-700">
                      <strong>Bloom Time:</strong> {plant.growthInfo.bloomTime}
                    </p>
                  )}
                  {plant.growthInfo.harvestTime && (
                    <p className="text-gray-700">
                      <strong>Harvest Time:</strong> {plant.growthInfo.harvestTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'planting' && (
          <div>
            {plant.plantingInstructions ? (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {plant.plantingInstructions}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No planting instructions available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'problems' && (
          <div>
            {plant.commonProblems && plant.commonProblems.length > 0 ? (
              <div className="space-y-4">
                {plant.commonProblems.map((problem, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {problem.problem}
                    </h3>
                    <p className="text-gray-700">
                      <strong>Solution:</strong> {problem.solution}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No common problems documented</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantInfo;
