'use client';

import { useAuth } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Providers } from '@/components/providers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PhotoIcon,
  SparklesIcon,
  ArrowLeftIcon,
  XMarkIcon,
  LightBulbIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const itemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  type: z.string().min(1, 'Please select a type'),
  size: z.string().min(1, 'Please select a size'),
  condition: z.string().min(1, 'Please select a condition'),
  points_value: z.number().min(1, 'Points value must be at least 1').max(1000, 'Points value cannot exceed 1000'),
  tags: z.string().optional()
});

type ItemFormData = z.infer<typeof itemSchema>;

const categories = [
  'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'
];

const types = {
  tops: ['t-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'tank-top'],
  bottoms: ['jeans', 'pants', 'shorts', 'skirt', 'leggings'],
  dresses: ['casual', 'formal', 'maxi', 'mini', 'midi'],
  outerwear: ['jacket', 'coat', 'blazer', 'cardigan', 'vest'],
  shoes: ['sneakers', 'boots', 'sandals', 'heels', 'flats'],
  accessories: ['bag', 'hat', 'scarf', 'jewelry', 'belt']
};

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const conditions = ['new', 'like-new', 'good', 'fair'];

export default function AddItemPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    title?: string;
    description?: string;
    points?: number;
    tags?: string[];
  }>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      points_value: 50
    }
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (loading) return;

    if (!user) {
      router.push('/auth/signin');
    }
  }, [mounted, loading, user, router]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of acceptedFiles) {
        // Create a preview URL for immediate display
        const previewUrl = URL.createObjectURL(file);
        newImages.push(previewUrl);

        // For now, we'll use the preview URL as the image URL
        // In a real app, you'd upload to Supabase Storage or another service
        // const fileExt = file.name.split('.').pop();
        // const fileName = `${Math.random()}.${fileExt}`;
        // const filePath = `${user?.id}/${fileName}`;
        
        // const { error: uploadError } = await supabase.storage
        //   .from('item-images')
        //   .upload(filePath, file);

        // if (uploadError) throw uploadError;

        // const { data: { publicUrl } } = supabase.storage
        //   .from('item-images')
        //   .getPublicUrl(filePath);

        // newImages.push(publicUrl);
      }

      setUploadedImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateAISuggestions = async () => {
    if (!selectedCategory || !watch('type')) return;

    try {
      // Simulate AI suggestions based on category and type
      const suggestions = {
        title: `${watch('type')} ${selectedCategory} - Sustainable Fashion`,
        description: `Beautiful ${watch('condition')} ${watch('type')} in the ${selectedCategory} category. Perfect for sustainable fashion enthusiasts looking to give this piece a second life.`,
        points: Math.floor(Math.random() * 100) + 25,
        tags: [selectedCategory, watch('type'), 'sustainable', 'fashion', 'swap']
      };

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  };

  const applyAISuggestion = (field: keyof typeof aiSuggestions) => {
    if (aiSuggestions[field]) {
      if (field === 'title') {
        setValue('title', aiSuggestions.title!);
      } else if (field === 'description') {
        setValue('description', aiSuggestions.description!);
      } else if (field === 'points') {
        setValue('points_value', aiSuggestions.points!);
      } else if (field === 'tags') {
        setValue('tags', aiSuggestions.tags!.join(', '));
      }
    }
  };

  const onSubmit = async (data: ItemFormData) => {
    if (!user || uploadedImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    try {
      setSubmitting(true);

      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      const { error } = await supabase
        .from('items')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          size: data.size,
          condition: data.condition,
          points_value: data.points_value,
          tags,
          images: uploadedImages,
          user_id: user.id,
          status: 'available'
        });

      if (error) throw error;

      alert('Item listed successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gradient mb-4">
              List Your Item
            </h1>
            <p className="text-xl text-gray-600">
              Give your clothes a second life and earn points for sustainable fashion
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Image Upload */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
              <p className="text-gray-600 mb-4">
                Upload up to 5 high-quality images of your item. First image will be the main photo.
              </p>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'
                }`}
              >
                <input {...getInputProps()} />
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-emerald-600">Drop the images here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop images here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, WEBP up to 5MB each
                    </p>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Uploading images...</p>
                </div>
              )}

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Uploaded Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Suggestions */}
            {selectedCategory && watch('type') && (
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <LightBulbIcon className="h-6 w-6 text-amber-500 mr-2" />
                  <h2 className="text-2xl font-bold">AI Suggestions</h2>
                  <button
                    type="button"
                    onClick={generateAISuggestions}
                    className="ml-auto btn-secondary text-sm"
                  >
                    <SparklesIcon className="h-4 w-4 mr-1" />
                    Generate
                  </button>
                </div>
                
                {Object.keys(aiSuggestions).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSuggestions.title && (
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Suggested Title</h3>
                        <p className="text-sm text-gray-700 mb-2">{aiSuggestions.title}</p>
                        <button
                          type="button"
                          onClick={() => applyAISuggestion('title')}
                          className="text-sm text-amber-600 hover:text-amber-700"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    )}
                    
                    {aiSuggestions.description && (
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Suggested Description</h3>
                        <p className="text-sm text-gray-700 mb-2">{aiSuggestions.description}</p>
                        <button
                          type="button"
                          onClick={() => applyAISuggestion('description')}
                          className="text-sm text-amber-600 hover:text-amber-700"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    )}
                    
                    {aiSuggestions.points && (
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Suggested Points Value</h3>
                        <p className="text-sm text-gray-700 mb-2">{aiSuggestions.points} points</p>
                        <button
                          type="button"
                          onClick={() => applyAISuggestion('points')}
                          className="text-sm text-amber-600 hover:text-amber-700"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    )}
                    
                    {aiSuggestions.tags && (
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Suggested Tags</h3>
                        <p className="text-sm text-gray-700 mb-2">{aiSuggestions.tags.join(', ')}</p>
                        <button
                          type="button"
                          onClick={() => applyAISuggestion('tags')}
                          className="text-sm text-amber-600 hover:text-amber-700"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Item Details */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Item Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Vintage Denim Jacket"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Describe your item in detail..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    {...register('type')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    disabled={!selectedCategory}
                  >
                    <option value="">Select Type</option>
                    {selectedCategory && types[selectedCategory as keyof typeof types]?.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size *
                  </label>
                  <select
                    {...register('size')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.size && (
                    <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
                  )}
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    {...register('condition')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select Condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                  )}
                </div>

                {/* Points Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Value *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      {...register('points_value', { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="50"
                      min="1"
                      max="1000"
                    />
                  </div>
                  {errors.points_value && (
                    <p className="text-red-500 text-sm mt-1">{errors.points_value.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Set the points value for your item (1-1000)
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="vintage, sustainable, fashion (comma separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add tags to help others find your item
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || uploadedImages.length === 0}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating Item...' : 'List Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Providers>
  );
} 