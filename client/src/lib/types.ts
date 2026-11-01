export type CategoryType =
  | 'All'
  | 'Books'
  | 'Cycles'
  | 'Gadgets'
  | 'Hostel Essentials'
  | 'Furniture'
  | 'Other';

export type ConditionType = 'All' | 'New' | 'Like new' | 'Good' | 'Fair';

export type SortType = 'newest' | 'price_asc' | 'price_desc' | 'oldest';

export interface User {
  id: string;
  name: string;
  email: string;
  hostelArea: string;
  roomNumber?: string;
  phone?: string;
  whatsappNumber?: string;
  preferredContactMethod: 'whatsapp' | 'email' | 'phone';
  savedListings: string[];
  createdAt: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: CategoryType;
  condition: ConditionType;
  hostelArea: string;
  images: string[];
  sellerId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        hostelArea: string;
        phone?: string;
        whatsappNumber?: string;
        preferredContactMethod?: 'whatsapp' | 'email' | 'phone';
      };
  sellerName: string;
  contactMethod?: 'whatsapp' | 'email' | 'phone' | null;
  contactInfo?: string | null;
  canViewContact?: boolean;
  isOwner?: boolean;
  status: 'active' | 'sold';
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

export interface FilterState {
  q: string;
  category: CategoryType;
  condition: ConditionType;
  hostelArea: string;
  minPrice: string;
  maxPrice: string;
  sort: SortType;
  status: 'active' | 'sold' | 'all';
}
