// types/faq.types.ts
export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQItemWithCategory extends FAQItem {
  faqCategory: FAQCategory;
}

export interface FAQCategoryWithCount extends FAQCategory {
  count: number;
}

// Request DTOs
export interface CreateFAQItemRequest {
  category: string;
  question: string;
  answer: string;
  popular?: boolean;
}

export interface UpdateFAQItemRequest {
  category?: string;
  question?: string;
  answer?: string;
  popular?: boolean;
}

export interface CreateFAQCategoryRequest {
  id: string;
  name: string;
  icon: string;
}

export interface UpdateFAQCategoryRequest {
  name?: string;
  icon?: string;
}

// Response DTOs
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}

export interface PaginationOptions {
  skip?: number;
  take?: number;
  includeCategory?: boolean;
}

export interface SearchOptions extends PaginationOptions {
  query?: string;
  category?: string;
  popular?: boolean;
}

export interface FAQStats {
  totalItems: number;
  totalCategories: number;
  popularItems: number;
  itemsByCategory: Array<{
    category: string;
    count: number;
  }>;
}