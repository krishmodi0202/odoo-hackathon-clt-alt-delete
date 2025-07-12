export const APP_CONFIG = {
  name: 'ReWear',
  description: 'Community Clothing Exchange Platform',
  version: '1.0.0',
} as const;

export const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Bags',
  'Jewelry',
] as const;

export const TYPES = [
  'Casual',
  'Formal',
  'Sportswear',
  'Vintage',
  'Designer',
  'Streetwear',
  'Business',
  'Evening',
] as const;

export const SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'One Size',
] as const;

export const CONDITIONS = [
  'New with tags',
  'Like new',
  'Excellent',
  'Good',
  'Fair',
  'Poor',
] as const;

export const POINTS_VALUES = {
  NEW_WITH_TAGS: 100,
  LIKE_NEW: 80,
  EXCELLENT: 60,
  GOOD: 40,
  FAIR: 20,
  POOR: 10,
} as const;

export const ITEMS_PER_PAGE = 12;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  DASHBOARD: '/dashboard',
  ADD_ITEM: '/items/add',
  ITEM_DETAIL: '/items/[id]',
  BROWSE: '/browse',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const; 