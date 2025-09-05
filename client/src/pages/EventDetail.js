import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import eventService from '../services/eventService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShareIcon,
  EyeIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const EventDetail = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(id);
      setEvent(response.data.event);
      setRelatedEvents(response.data.relatedEvents || []);
      
      // Increment view count
      await eventService.incrementEventView(id);
    } catch (err) {
      setError(err.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'workshop': 'bg-blue-100 text-blue-800',
      'plant-fair': 'bg-green-100 text-green-800',
      'seasonal-campaign': 'bg-orange-100 text-orange-800',
      'webinar': 'bg-purple-100 text-purple-800',
      'garden-tour': 'bg-emerald-100 text-emerald-800',
      'plant-swap': 'bg-yellow-100 text-yellow-800',
      'community-garden': 'bg-indigo-100 text-indigo-800',
      'expert-talk': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event URL copied to clipboard!');
    }
  };

  const handleEdit = () => {
    navigate(`/admin/events/${event._id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(event._id);
        toast.success('Event deleted successfully!');
        navigate('/events');
      } catch (err) {
        toast.error('Failed to delete event: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Link to="/events" className="btn-primary">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Event not found</h3>
          <p className="mt-1 text-sm text-gray-500">The event you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link to="/events" className="btn-primary">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [event.featuredImage, ...(event.images || [])];
  const isUpcoming = new Date(event.startDate) > new Date();
  const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
  const isPast = new Date(event.endDate) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/events" className="hover:text-primary-600 flex items-center">
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Events
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{event.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Image Gallery */}
              <div className="relative">
                <img
                  src={allImages[activeImageIndex]?.url}
                  alt={allImages[activeImageIndex]?.alt || event.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                
                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === activeImageIndex ? 'bg-white' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {event.featured && (
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <StarIconSolid className="h-3 w-3" />
                      Featured
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>

                {/* Admin Actions */}
                {isAdmin() && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={handleEdit}
                      className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-colors"
                      title="Edit Event"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full transition-colors"
                      title="Delete Event"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="absolute bottom-4 right-4">
                  {isUpcoming && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Upcoming
                    </div>
                  )}
                  {isOngoing && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      Ongoing
                    </div>
                  )}
                  {isPast && (
                    <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <EyeIcon className="h-4 w-4" />
                      <span>{event.viewCount} views</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getDifficultyColor(event.difficulty)}`}>
                        {event.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleShare}
                    className="btn-secondary flex items-center gap-2 ml-4"
                  >
                    <ShareIcon className="h-4 w-4" />
                    Share
                  </button>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.shortDescription}
                </p>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 hover:from-primary-100 hover:to-primary-200 transition-all duration-200 cursor-pointer"
                        >
                          <span className="text-primary-500 mr-1">#</span>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <div className="prose max-w-none text-gray-700">
                {event.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            {event.whatToExpect && event.whatToExpect.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What to Expect</h2>
                <ul className="space-y-2">
                  {event.whatToExpect.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials */}
            {event.materials && event.materials.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Materials</h2>
                <div className="space-y-2">
                  {event.materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{material.item}</span>
                      <div className="flex items-center gap-2 text-sm">
                        {material.required && (
                          <span className="text-red-600 font-medium">Required</span>
                        )}
                        {material.providedByOrganizer && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Provided
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Organizer</h2>
              <div className="flex items-center gap-4">
                <img
                  src={event.organizer.profileImage || '/default-avatar.png'}
                  alt={`${event.organizer.firstName} ${event.organizer.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">@{event.organizer.username}</p>
                  {event.organizer.experienceLevel && (
                    <p className="text-sm text-gray-500 capitalize">
                      {event.organizer.experienceLevel} Level
                    </p>
                  )}
                </div>
                <Link
                  to={`/gardeners/${event.organizer._id}`}
                  className="btn-secondary"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(event.startDate)}
                    </p>
                    {event.startDate !== event.endDate && (
                      <p className="text-sm text-gray-500">
                        to {formatDate(event.endDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatTime(event.startDate)}
                    </p>
                    {event.formattedDuration && (
                      <p className="text-sm text-gray-500">
                        Duration: {event.formattedDuration}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.location.type === 'online' ? 'Online Event' :
                       event.location.type === 'hybrid' ? 'Hybrid Event' :
                       event.location.venue || 'Physical Event'}
                    </p>
                    {event.location.address && (
                      <p className="text-sm text-gray-500">
                        {event.location.address.street}, {event.location.address.city}
                      </p>
                    )}
                    {event.location.onlineLink && (
                      <a
                        href={event.location.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Join Online
                      </a>
                    )}
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <UserGroupIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {event.availableSpots} spots available
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.currentRegistrations}/{event.capacity} registered
                      </p>
                    </div>
                  </div>
                )}

                {event.price > 0 && (
                  <div className="flex items-start gap-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        ${event.price} {event.currency}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {isUpcoming && event.isRegistrationOpen ? (
                  <button className="btn-primary w-full">
                    Register for Event
                  </button>
                ) : isUpcoming ? (
                  <button className="btn-secondary w-full" disabled>
                    Registration Closed
                  </button>
                ) : isOngoing ? (
                  <button className="btn-primary w-full">
                    Join Event
                  </button>
                ) : (
                  <button className="btn-secondary w-full" disabled>
                    Event Completed
                  </button>
                )}
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Events</h3>
                <div className="space-y-4">
                  {relatedEvents.slice(0, 3).map((relatedEvent) => (
                    <Link
                      key={relatedEvent._id}
                      to={`/events/${relatedEvent.slug || relatedEvent._id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={relatedEvent.featuredImage.url}
                          alt={relatedEvent.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                            {relatedEvent.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(relatedEvent.startDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/events"
                  className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 pt-4 border-t border-gray-200"
                >
                  View All Events
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
