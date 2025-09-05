import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import plantService from '../services/plantService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const AddEditPlant = () => {
  const { id } = useParams(); // If id exists, we're editing
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'indoor',
    type: 'plant',
    shortDescription: '',
    fullDescription: '',
    images: [{ url: '', alt: '', isPrimary: true }],
    careInstructions: {
      sunlight: '',
      water: '',
      soilType: '',
      humidity: '',
      temperature: { min: '', max: '', unit: 'celsius' },
      fertilizer: { frequency: '', fertilizerType: '' }
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: '',
      matureSize: { 
        height: { value: '', unit: 'cm' },
        width: { value: '', unit: 'cm' }
      },
      bloomTime: '',
      harvestTime: ''
    },
    benefits: [''],
    tags: [''],
    plantingInstructions: '',
    commonProblems: [{ problem: '', solution: '' }],
    price: { amount: '', currency: 'USD' }
  });

  useEffect(() => {
    // Check if user has permission
    if (!user || (user.role !== 'gardener' && user.role !== 'admin')) {
      toast.error('You need to be a gardener or admin to access this page');
      navigate('/plants');
      return;
    }

    if (isEditing) {
      fetchPlant();
    }
  }, [id, user, navigate, isEditing]);

  const fetchPlant = async () => {
    try {
      setLoading(true);
      const response = await plantService.getPlantById(id);
      const plant = response.data.plant;
      
      // Check if user owns this plant or is admin
      if (user.role !== 'admin' && plant.addedBy._id !== user._id) {
        toast.error('You can only edit plants you created');
        navigate('/plants');
        return;
      }

      setFormData({
        name: plant.name || '',
        scientificName: plant.scientificName || '',
        category: plant.category || 'indoor',
        type: plant.type || 'plant',
        shortDescription: plant.shortDescription || '',
        fullDescription: plant.fullDescription || '',
        images: plant.images?.length ? plant.images : [{ url: '', alt: '', isPrimary: true }],
        careInstructions: {
          sunlight: plant.careInstructions?.sunlight || '',
          water: plant.careInstructions?.water || '',
          soilType: plant.careInstructions?.soilType || '',
          humidity: plant.careInstructions?.humidity || '',
          temperature: {
            min: plant.careInstructions?.temperature?.min || '',
            max: plant.careInstructions?.temperature?.max || '',
            unit: plant.careInstructions?.temperature?.unit || 'celsius'
          },
          fertilizer: {
            frequency: plant.careInstructions?.fertilizer?.frequency || '',
            fertilizerType: plant.careInstructions?.fertilizer?.fertilizerType || ''
          }
        },
        growthInfo: {
          difficulty: plant.growthInfo?.difficulty || 'beginner',
          growthRate: plant.growthInfo?.growthRate || '',
          matureSize: {
            height: {
              value: plant.growthInfo?.matureSize?.height?.value || '',
              unit: plant.growthInfo?.matureSize?.height?.unit || 'cm'
            },
            width: {
              value: plant.growthInfo?.matureSize?.width?.value || '',
              unit: plant.growthInfo?.matureSize?.width?.unit || 'cm'
            }
          },
          bloomTime: plant.growthInfo?.bloomTime || '',
          harvestTime: plant.growthInfo?.harvestTime || ''
        },
        benefits: plant.benefits?.length ? plant.benefits : [''],
        tags: plant.tags?.length ? plant.tags : [''],
        plantingInstructions: plant.plantingInstructions || '',
        commonProblems: plant.commonProblems?.length ? plant.commonProblems : [{ problem: '', solution: '' }],
        price: {
          amount: plant.price?.amount || '',
          currency: plant.price?.currency || 'USD'
        }
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch plant details');
      navigate('/plants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Clean up form data
      const cleanedData = {
        ...formData,
        benefits: formData.benefits.filter(b => b.trim()),
        tags: formData.tags.filter(t => t.trim()),
        images: formData.images.filter(img => img.url.trim()),
        commonProblems: formData.commonProblems.filter(p => p.problem.trim() && p.solution.trim()),
        // Clean up care instructions - remove empty values
        careInstructions: {
          sunlight: formData.careInstructions.sunlight || undefined,
          water: formData.careInstructions.water || undefined,
          soilType: formData.careInstructions.soilType || undefined,
          humidity: formData.careInstructions.humidity || undefined,
          temperature: {
            min: formData.careInstructions.temperature.min || undefined,
            max: formData.careInstructions.temperature.max || undefined,
            unit: formData.careInstructions.temperature.unit || 'celsius'
          },
          fertilizer: {
            frequency: formData.careInstructions.fertilizer.frequency || undefined,
            fertilizerType: formData.careInstructions.fertilizer.fertilizerType || undefined
          }
        },
        // Clean up growth info
        growthInfo: {
          difficulty: formData.growthInfo.difficulty || 'beginner',
          growthRate: formData.growthInfo.growthRate || undefined,
          matureSize: {
            height: {
              value: formData.growthInfo.matureSize.height.value || undefined,
              unit: formData.growthInfo.matureSize.height.unit || 'cm'
            },
            width: {
              value: formData.growthInfo.matureSize.width.value || undefined,
              unit: formData.growthInfo.matureSize.width.unit || 'cm'
            }
          },
          bloomTime: formData.growthInfo.bloomTime || undefined,
          harvestTime: formData.growthInfo.harvestTime || undefined
        },
        // Clean up price
        price: {
          amount: formData.price.amount || undefined,
          currency: formData.price.currency || 'USD'
        }
      };

             // Remove empty care instruction objects
       if (cleanedData.type !== 'plant' && cleanedData.type !== 'seed') {
         // For tools, fertilizers, accessories - remove care instructions completely
         cleanedData.careInstructions = undefined;
         cleanedData.growthInfo = undefined;
       } else if (!cleanedData.careInstructions.sunlight && 
           !cleanedData.careInstructions.water && 
           !cleanedData.careInstructions.soilType) {
         // For plants/seeds with empty care instructions
         cleanedData.careInstructions = undefined;
       } else {
                   // Remove empty fertilizer object
          if (!cleanedData.careInstructions.fertilizer.frequency && 
              !cleanedData.careInstructions.fertilizer.fertilizerType) {
            cleanedData.careInstructions.fertilizer = undefined;
          }

         // Remove empty temperature object
         if (!cleanedData.careInstructions.temperature.min && 
             !cleanedData.careInstructions.temperature.max) {
           cleanedData.careInstructions.temperature = undefined;
         }
       }

      if (isEditing) {
        await plantService.updatePlant(id, cleanedData);
        toast.success('Plant updated successfully!');
      } else {
        await plantService.createPlant(cleanedData);
        toast.success('Plant created successfully!');
      }
      
      navigate('/plants');
    } catch (error) {
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} plant`);
    } finally {
      setSubmitting(false);
    }
  };

  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (arrayPath, defaultValue) => {
    setFormData(prev => ({
      ...prev,
      [arrayPath]: [...prev[arrayPath], defaultValue]
    }));
  };

  const removeArrayItem = (arrayPath, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayPath]: prev[arrayPath].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (arrayPath, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayPath]: prev[arrayPath].map((item, i) => i === index ? value : item)
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-8">
            <button
              type="button"
              onClick={() => navigate('/plants')}
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors mr-4"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Plants
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isEditing ? 'Edit Plant' : 'Add New Plant'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plant Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scientific Name
                  </label>
                  <input
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) => updateFormData('scientificName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="herbs">Herbs</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="flowers">Flowers</option>
                    <option value="trees">Trees</option>
                    <option value="succulents">Succulents</option>
                    <option value="tools">Tools</option>
                    <option value="fertilizers">Fertilizers</option>
                    <option value="seeds">Seeds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateFormData('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="plant">Plant</option>
                    <option value="seed">Seed</option>
                    <option value="tool">Tool</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => updateFormData('shortDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Brief description (max 200 characters)"
                  maxLength={200}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.shortDescription.length}/200 characters
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => updateFormData('fullDescription', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Detailed description"
                  required
                />
              </div>
            </section>

            {/* Images */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
              {formData.images.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL *
                      </label>
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => updateArrayItem('images', index, { ...image, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateArrayItem('images', index, { ...image, alt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={image.isPrimary}
                        onChange={(e) => {
                          // Ensure only one image is primary
                          const updatedImages = formData.images.map((img, i) => ({
                            ...img,
                            isPrimary: i === index ? e.target.checked : false
                          }));
                          setFormData(prev => ({ ...prev, images: updatedImages }));
                        }}
                        className="mr-2"
                      />
                      Primary Image
                    </label>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('images', { url: '', alt: '', isPrimary: false })}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Image
              </button>
            </section>

                         {/* Care Instructions (only for plants) */}
             {(formData.type === 'plant' || formData.type === 'seed') && (
               <section>
                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Care Instructions</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Sunlight *
                     </label>
                     <select
                       value={formData.careInstructions.sunlight}
                       onChange={(e) => updateFormData('careInstructions.sunlight', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                       required
                     >
                       <option value="">Select...</option>
                       <option value="low">Low</option>
                       <option value="medium">Medium</option>
                       <option value="high">High</option>
                       <option value="direct">Direct</option>
                       <option value="indirect">Indirect</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Water *
                     </label>
                     <select
                       value={formData.careInstructions.water}
                       onChange={(e) => updateFormData('careInstructions.water', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                       required
                     >
                       <option value="">Select...</option>
                       <option value="low">Low</option>
                       <option value="medium">Medium</option>
                       <option value="high">High</option>
                       <option value="daily">Daily</option>
                       <option value="weekly">Weekly</option>
                       <option value="bi-weekly">Bi-weekly</option>
                       <option value="monthly">Monthly</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Soil Type *
                     </label>
                     <select
                       value={formData.careInstructions.soilType}
                       onChange={(e) => updateFormData('careInstructions.soilType', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                       required
                     >
                       <option value="">Select...</option>
                       <option value="well-draining">Well-draining</option>
                       <option value="moist">Moist</option>
                       <option value="sandy">Sandy</option>
                       <option value="loamy">Loamy</option>
                       <option value="clay">Clay</option>
                       <option value="acidic">Acidic</option>
                       <option value="alkaline">Alkaline</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Difficulty *
                     </label>
                     <select
                       value={formData.growthInfo.difficulty}
                       onChange={(e) => updateFormData('growthInfo.difficulty', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                       required
                     >
                       <option value="beginner">Beginner</option>
                       <option value="intermediate">Intermediate</option>
                       <option value="advanced">Advanced</option>
                       <option value="expert">Expert</option>
                     </select>
                   </div>
                 </div>
               </section>
             )}

            {/* Price */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Price (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price.amount}
                    onChange={(e) => updateFormData('price.amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.price.currency}
                    onChange={(e) => updateFormData('price.currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Tags */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter tag"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('tags', '')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Tag
              </button>
            </section>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/plants')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Plant' : 'Create Plant'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditPlant;
