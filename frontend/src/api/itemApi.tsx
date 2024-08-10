import api from "./api";
import {
  SearchRequest,
  SearchItems,
  Categories,
  AggregatedItemsByCategory,
  AddUpdateItemRequest,
  AddedUpdatedItemId,
} from "../types/api";

export const getCategories = async (): Promise<Categories> => {
  const response = await api.get<Categories>("/items/categories");
  return response.data;
};

export const getAllItems = async (): Promise<SearchItems> => {
  const response = await api.get<SearchItems>("/items");
  return response.data;
};

export const filterItems = async (
  payload: SearchRequest | undefined
): Promise<SearchItems> => {
  const response = await api.post("/items/search", payload);
  return response.data;
};

export const getAggregatedItemsByCategory = async (
  payload: SearchRequest | undefined
): Promise<AggregatedItemsByCategory> => {
  const response = await api.post("/items/search", payload);
  return response.data;
};

export const addOrUpdateItem = async (
  payload: AddUpdateItemRequest
): Promise<AddedUpdatedItemId> => {
  const response = await api.post("/items", payload);
  return response.data;
};
