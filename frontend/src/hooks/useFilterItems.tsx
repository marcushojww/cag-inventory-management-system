import { useQuery } from "@tanstack/react-query";
import { SearchRequest } from "../types/api";
import { filterItems } from "../api/itemApi";

const useFilterItems = (payload: SearchRequest | undefined) => {
  return useQuery({
    queryKey: ["filteredItems"],
    queryFn: () => filterItems(payload),
  });
};

export default useFilterItems;
