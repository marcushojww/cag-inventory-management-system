import { Item } from "./item";

// /items/categories

export interface Categories {
  categories: string[];
}

export interface CategoryItems {
  items: Item[];
}

// /items/search

export interface SearchRequest {
  category: string;
}

export interface AggregatedItemByCategory {
  category: string;
  total_price: number;
  count: number;
}

export interface AggregatedItemsByCategory {
  items: AggregatedItemByCategory[];
}

export interface SearchItems {
  items: Item[];
}

// /items

export interface AddUpdateItemRequest {
  name: string;
  category: string;
  price: number;
}

export interface AddedUpdatedItemId {
  id: string;
}
