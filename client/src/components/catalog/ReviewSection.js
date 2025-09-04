import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import reviewService from '../../services/reviewService';
import LoadingSpinner from '../common/LoadingSpinner';

const ReviewSection = ({ plantId, reviews, loading, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to leave a review');
      return;
    }

    try {
      setSubmitting(true);
      const response = await reviewService.createReview(plantId, reviewForm);
      
      // Add the new review to the reviews list immediately
      const newReview = response.data;
      onReviewSubmitted(newReview);
      
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      await reviewService.voteHelpful(reviewId);
      toast.success('Vote recorded!');
      onReviewSubmitted(); // Refresh reviews
    } catch (error) {
      toast.error(error.message || 'Failed to vote');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating, interactive = false, onChange }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange(i + 1) : undefined}
          className={`h-5 w-5 ${interactive ? 'cursor-pointer hover:scale-110' : ''} ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          disabled={!interactive}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews ({reviews.length})
        </h2>
        
        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <StarRating
                rating={reviewForm.rating}
                interactive={true}
                onChange={(rating) => setReviewForm({ ...reviewForm, rating })}
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                id="title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Summarize your experience..."
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Share your experience with this plant..."
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (() => {
        const validReviews = reviews.filter(review => {
          // More lenient filtering - just check if review exists and has basic data
          return review && review._id && review.title && review.comment;
        });
        
        if (validReviews.length === 0) {
          return (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {reviews.length > 0 ? 'No valid reviews' : 'No reviews yet'}
              </h3>
              <p className="text-gray-600">
                {reviews.length > 0 
                  ? 'Some reviews may have been removed or are no longer available.' 
                  : 'Be the first to review this plant!'
                }
              </p>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            {validReviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {review.user && review.user.profileImage ? (
                        <img
                          src={review.user.profileImage}
                          alt={`${review.user.firstName} ${review.user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {review.user ? `${review.user.firstName?.[0] || ''}${review.user.lastName?.[0] || ''}` : 'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {review.user ? `${review.user.firstName || ''} ${review.user.lastName || ''}` : 'Anonymous User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <StarRating rating={review.rating} />
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {review.title}
                </h4>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleVoteHelpful(review._id)}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Helpful ({review.helpfulVotes || 0})
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
};

export default ReviewSection;
