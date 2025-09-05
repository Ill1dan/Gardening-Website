import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import eventService from '../services/eventService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { 
  PlusIcon, 
  TrashIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

const AddEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    type: 'workshop',
    category: 'beginner',
    difficulty: 'beginner',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: {
      type: 'online',
      venue: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      onlineLink: ''
    },
    capacity: '',
    price: 0,
    currency: 'USD',
    featuredImage: {
      url: '',
      alt: ''
    },
    images: [],
    tags: [],
    tagsInput: '',
    requirements: [],
    whatToExpect: [],
    materials: [],
    duration: {
      hours: 1,
      minutes: 0
    },
    status: 'draft',
    featured: false
  });

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'plant-fair', label: 'Plant Fair' },
    { value: 'seasonal-campaign', label: 'Seasonal Campaign' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'garden-tour', label: 'Garden Tour' },
    { value: 'plant-swap', label: 'Plant Swap' },
    { value: 'community-garden', label: 'Community Garden' },
    { value: 'expert-talk', label: 'Expert Talk' }
  ];

  const categories = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'all-levels', label: 'All Levels' },
    { value: 'kids', label: 'Kids' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'community', label: 'Community' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const locationTypes = [
    { value: 'online', label: 'Online' },
    { value: 'physical', label: 'Physical' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    if (isEditing) {
      fetchEvent();
    }
  }, [id, isAdmin, navigate, isEditing]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(id, false);
      const event = response.data.event;
      
      // Format dates for datetime-local input
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        shortDescription: event.shortDescription || '',
        type: event.type || 'workshop',
        category: event.category || 'beginner',
        difficulty: event.difficulty || 'beginner',
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        registrationDeadline: event.registrationDeadline ? formatDateForInput(event.registrationDeadline) : '',
        location: {
          type: event.location?.type || 'online',
          venue: event.location?.venue || '',
          address: {
            street: event.location?.address?.street || '',
            city: event.location?.address?.city || '',
            state: event.location?.address?.state || '',
            zipCode: event.location?.address?.zipCode || '',
            country: event.location?.address?.country || 'USA'
          },
          onlineLink: event.location?.onlineLink || ''
        },
        capacity: event.capacity || '',
        price: event.price || 0,
        currency: event.currency || 'USD',
        featuredImage: {
          url: event.featuredImage?.url || '',
          alt: event.featuredImage?.alt || ''
        },
        images: event.images || [],
        tags: event.tags || [],
        tagsInput: (event.tags || []).join(', '),
        requirements: event.requirements || [],
        whatToExpect: event.whatToExpect || [],
        materials: event.materials || [],
        duration: {
          hours: event.duration?.hours || 1,
          minutes: event.duration?.minutes || 0
        },
        status: event.status || 'draft',
        featured: event.featured || false
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: type === 'checkbox' ? checked : value
          } : type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (e) => {
    // Store the raw input value, let user type commas freely
    const rawValue = e.target.value;
    
    // Only process tags when user finishes typing (on blur) or form submission
    // For now, just store the raw string and we'll process it differently
    setFormData(prev => ({
      ...prev,
      tagsInput: rawValue,
      tags: rawValue.split(',').map(tag => tag.trim()).filter(tag => tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Event title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Event description is required');
      }
      if (!formData.shortDescription.trim()) {
        throw new Error('Short description is required');
      }
      if (!formData.startDate) {
        throw new Error('Start date is required');
      }
      if (!formData.endDate) {
        throw new Error('End date is required');
      }
      if (!formData.featuredImage.url) {
        throw new Error('Featured image is required');
      }

      // Validate dates
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        throw new Error('End date must be after start date');
      }

      if (formData.registrationDeadline && new Date(formData.registrationDeadline) >= new Date(formData.startDate)) {
        throw new Error('Registration deadline must be before start date');
      }

      const eventData = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };

      // Remove UI-only fields
      delete eventData.tagsInput;

      // Only include capacity if it has a value
      if (formData.capacity !== '' && formData.capacity !== null && formData.capacity !== undefined) {
        const capacityValue = typeof formData.capacity === 'string' ? formData.capacity.trim() : formData.capacity.toString();
        if (capacityValue !== '') {
          eventData.capacity = parseInt(capacityValue);
        }
      }

      // Clean up empty strings in nested objects
      if (eventData.location.venue === '') {
        delete eventData.location.venue;
      }
      if (eventData.location.onlineLink === '') {
        delete eventData.location.onlineLink;
      }
      if (eventData.registrationDeadline === '') {
        delete eventData.registrationDeadline;
      }

      let response;
      if (isEditing) {
        response = await eventService.updateEvent(id, eventData);
        toast.success('Event updated successfully!');
      } else {
        response = await eventService.createEvent(eventData);
        toast.success('Event created successfully!');
      }

      navigate(`/events/${response.data.slug || response.data._id}`);
    } catch (err) {
      console.error('Event creation/update error:', err);
      
      // Handle validation errors from the server
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map(error => error.message || error.msg).join(', ');
        setError(`Validation errors: ${errorMessages}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(`Failed to ${isEditing ? 'update' : 'create'} event`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Event' : 'Create New Event'}
              </h1>
              <button
                onClick={() => navigate('/events')}
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                View All Events
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description for event listings"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.shortDescription.length}/300 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Detailed description of the event"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/2000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tagsInput || (formData.tags || []).join(', ')}
                  onChange={handleTagsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="gardening, plants, workshop"
                />
                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Tags preview:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Date and Time</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    name="duration.hours"
                    value={formData.duration.hours}
                    onChange={handleInputChange}
                    min="0"
                    max="168"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    name="duration.minutes"
                    value={formData.duration.minutes}
                    onChange={handleInputChange}
                    min="0"
                    max="59"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Type *
                </label>
                <select
                  name="location.type"
                  value={formData.location.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {locationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {(formData.location.type === 'physical' || formData.location.type === 'hybrid') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      name="location.venue"
                      value={formData.location.venue}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Community Center, Garden Club, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="location.address.street"
                        value={formData.location.address.street}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="location.address.city"
                        value={formData.location.address.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="location.address.state"
                        value={formData.location.address.state}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="location.address.zipCode"
                        value={formData.location.address.zipCode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="location.address.country"
                        value={formData.location.address.country}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {(formData.location.type === 'online' || formData.location.type === 'hybrid') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Online Meeting Link
                  </label>
                  <input
                    type="url"
                    name="location.onlineLink"
                    value={formData.location.onlineLink}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              )}
            </div>

            {/* Capacity and Pricing */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Capacity and Pricing</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="10000"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    maxLength="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Images</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL *
                </label>
                <input
                  type="url"
                  name="featuredImage.url"
                  value={formData.featuredImage.url}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image Alt Text
                </label>
                <input
                  type="text"
                  name="featuredImage.alt"
                  value={formData.featuredImage.alt}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
              
              {(formData.requirements || []).map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Event requirement"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="btn-secondary p-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="btn-secondary flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Requirement
              </button>
            </div>

            {/* What to Expect */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">What to Expect</h2>
              
              {(formData.whatToExpect || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('whatToExpect', index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="What participants can expect"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('whatToExpect', index)}
                    className="btn-secondary p-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('whatToExpect')}
                className="btn-secondary flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Expectation
              </button>
            </div>

            {/* Publishing Options */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Publishing Options</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Featured Event
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Event' : 'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditEvent;
