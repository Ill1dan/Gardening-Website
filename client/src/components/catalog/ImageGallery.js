import React, { useState } from 'react';

const ImageGallery = ({ images, plantName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || `${plantName} - Image ${selectedImage + 1}`}
          className="w-full h-96 object-cover"
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden ${
                selectedImage === index
                  ? 'ring-2 ring-green-500'
                  : 'hover:opacity-75'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${plantName} - Thumbnail ${index + 1}`}
                className="w-full h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center">
          <span className="text-sm text-gray-600">
            {selectedImage + 1} of {images.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
