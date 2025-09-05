import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import plantService from '../services/plantService';
import reviewService from '../services/reviewService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PlantCard from '../components/catalog/PlantCard';
import ReviewSection from '../components/catalog/ReviewSection';
import FavoriteButton from '../components/catalog/FavoriteButton';
import ImageGallery from '../components/catalog/ImageGallery';
import CareInstructions from '../components/catalog/CareInstructions';
import PlantInfo from '../components/catalog/PlantInfo';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchPlantDetails();
  }, [id]);

  useEffect(() => {
    if (user && plant && plant._id) {
      checkFavoriteStatus();
    }
  }, [user, plant]);

  const fetchPlantDetails = async () => {
    try {
      setLoading(true);
      const response = await plantService.getPlantById(id);
      setPlant(response.data.plant);
      setRelatedPlants(response.data.relatedPlants || []);
      
      // Fetch reviews
      fetchReviews();
    } catch (error) {
      toast.error(error.message || 'Failed to fetch plant details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await plantService.getPlantReviews(id, { limit: 10 });
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorited = await plantService.isFavorited(plant._id);
      setIsFavorited(favorited);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }

    if (!plant || !plant._id) {
      toast.error('Plant data not available');
      return;
    }

    try {
      if (isFavorited) {
        await plantService.removeFromFavorites(plant._id);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await plantService.addToFavorites(plant._id);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  const handleReviewSubmitted = (newReview = null) => {
    if (newReview) {
      // Add the new review to the existing reviews
      setReviews(prevReviews => [newReview, ...prevReviews]);
    } else {
      // Refresh reviews if no new review provided
      fetchReviews();
    }
    // Refresh plant details to update rating
    fetchPlantDetails();
  };

  const handleAdminDeletePlant = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${plant.name}"?\n\nThis will also delete all reviews and favorites for this plant.\n\nThis action cannot be undone!`)) {
      try {
        const result = await plantService.adminDeletePlant(id);
        if (result.success) {
          toast.success(result.message);
          navigate('/plants'); // Redirect to catalog after deletion
        }
      } catch (error) {
        console.error('Error deleting plant:', error);
        toast.error(error.message || 'Failed to delete plant');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Plant not found</h2>
          <Link
            to="/plants"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link to="/plants" className="text-gray-500 hover:text-gray-700">
                  Plant Catalog
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{plant.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={plant.images} plantName={plant.name} />
          </div>

          {/* Plant Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{plant.name}</h1>
                {plant.scientificName && (
                  <p className="text-lg text-gray-600 italic mt-1">
                    {plant.scientificName}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {user && (user.role === 'admin' || (plant.addedBy && plant.addedBy._id === user._id)) && (
                  <Link
                    to={`/plants/${plant._id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                )}
                {isAdmin() && (
                  <button
                    onClick={handleAdminDeletePlant}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
                {user && (
                  <FavoriteButton
                    isFavorited={isFavorited}
                    onToggle={handleFavoriteToggle}
                  />
                )}
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
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
                <span className="ml-2 text-sm text-gray-600">
                  {plant.averageRating.toFixed(1)} ({plant.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Category and Type */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {plant.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {plant.type}
              </span>
              {plant.growthInfo?.difficulty && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  plant.growthInfo.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  plant.growthInfo.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  plant.growthInfo.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {plant.growthInfo.difficulty}
                </span>
              )}
            </div>

            {/* Price */}
            {plant.price?.amount && (
              <div className="mb-6">
                <span className="text-2xl font-bold text-green-600">
                  ${plant.price.amount}
                </span>
                <span className="text-gray-500 ml-2">
                  {plant.price.currency}
                </span>
              </div>
            )}

            {/* Short Description */}
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {plant.shortDescription}
            </p>

            {/* Added By */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600">
                Added by{' '}
                {plant.addedBy ? (
                  <Link
                    to={`/gardeners/${plant.addedBy._id}`}
                    className="font-medium text-green-600 hover:text-green-800"
                  >
                    {plant.addedBy.firstName} {plant.addedBy.lastName}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-800">Unknown Gardener</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {plant.fullDescription}
            </p>
          </div>
        </div>

        {/* Plant Information Tabs */}
        {plant.type === 'plant' && (
          <div className="mt-12">
            <PlantInfo plant={plant} />
          </div>
        )}

        {/* Care Instructions */}
        {plant.type === 'plant' && plant.careInstructions && (
          <div className="mt-12">
            <CareInstructions careInstructions={plant.careInstructions} />
          </div>
        )}

        {/* Benefits */}
        {plant.benefits && plant.benefits.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plant.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reviews Section */}
        {plant._id && (
          <div className="mt-12">
            <ReviewSection
              plantId={plant._id}
              reviews={reviews}
              loading={reviewsLoading}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}

        {/* Related Plants */}
        {relatedPlants.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Plants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedPlants.map((relatedPlant) => (
                <PlantCard key={relatedPlant._id} plant={relatedPlant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetail;
