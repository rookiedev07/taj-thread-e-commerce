export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: ProductCategory;
  images: string[];
  sizes: Size[];
  colors: ColorOption[];
  fabric: string;
  careInstructions: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  deliveryEstimate: string;
}

export type ProductCategory =
  | 'womens'
  | 'mens'
  | 'streetwear'
  | 'outerwear'
  | 'footwear'
  | 'accessories';

export interface Size {
  value: string;
  label: string;
  available: boolean;
}

export interface ColorOption {
  name: string;
  value: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface FilterState {
  categories: ProductCategory[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  fabrics: string[];
  sortBy: SortOption;
}

export type SortOption =
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'popularity'
  | 'rating';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CheckoutState {
  step: 'shipping' | 'summary' | 'payment' | 'confirmation';
  shippingAddress: Address | null;
  paymentMethod: string | null;
  orderId: string | null;
}
