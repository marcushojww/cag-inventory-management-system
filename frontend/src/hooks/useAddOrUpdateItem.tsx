import { AddUpdateItemRequest } from "../types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateItem } from "../api/itemApi";

function useAddOrUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddUpdateItemRequest) => addOrUpdateItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allItems"] });
      queryClient.invalidateQueries({ queryKey: ["distinctCategories"] });
      queryClient.invalidateQueries({ queryKey: ["aggregatedItemsByCat"] });
      queryClient.invalidateQueries({ queryKey: ["filteredItems"] });
    },
  });
}

export default useAddOrUpdateItem;
