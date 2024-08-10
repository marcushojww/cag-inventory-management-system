import { SearchRequest } from "../types/api";
import { getAggregatedItemsByCategory } from "../api/itemApi";
import { useQuery } from "@tanstack/react-query";

function useGetAggregatedItemsByCategory(payload: SearchRequest | undefined) {
  return useQuery({
    queryKey: ["aggregatedItemsByCat"],
    queryFn: () => getAggregatedItemsByCategory(payload),
  });
}

export default useGetAggregatedItemsByCategory;
