import React from 'react';
import { Link } from 'react-router-dom';

const PlantCard = ({ plant }) => {
  const primaryImage = plant.images?.find(img => img.isPrimary) || plant.images?.[0];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      indoor: 'bg-blue-100 text-blue-800',
      outdoor: 'bg-green-100 text-green-800',
      herbs: 'bg-purple-100 text-purple-800',
      vegetables: 'bg-orange-100 text-orange-800',
      flowers: 'bg-pink-100 text-pink-800',
      trees: 'bg-green-200 text-green-900',
      succulents: 'bg-teal-100 text-teal-800',
      tools: 'bg-gray-100 text-gray-800',
      fertilizers: 'bg-yellow-100 text-yellow-800',
      seeds: 'bg-amber-100 text-amber-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/plants/${plant._id}`}>
        {/* Image */}
        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || plant.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {plant.name}
            </h3>
            {plant.scientificName && (
              <p className="text-sm text-gray-600 italic">
                {plant.scientificName}
              </p>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plant.category)}`}>
              {plant.category}
            </span>
            {plant.growthInfo?.difficulty && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.growthInfo.difficulty)}`}>
                {plant.growthInfo.difficulty}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm line-clamp-2 mb-3">
            {plant.shortDescription}
          </p>

          {/* Care Requirements */}
          {plant.type === 'plant' && plant.careInstructions && (
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
              {plant.careInstructions.sunlight && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  {plant.careInstructions.sunlight}
                </div>
              )}
              {plant.careInstructions.water && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415zM10 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {plant.careInstructions.water}
                </div>
              )}
            </div>
          )}

          {/* Rating and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {plant.averageRating > 0 && (
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(plant.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-600">
                    ({plant.reviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            {plant.price?.amount && (
              <span className="text-lg font-bold text-green-600">
                ${plant.price.amount}
              </span>
            )}
          </div>

          {/* Favorite Count */}
          {plant.favoriteCount > 0 && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {plant.favoriteCount} {plant.favoriteCount === 1 ? 'favorite' : 'favorites'}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PlantCard;
