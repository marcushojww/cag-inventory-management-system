import { getAllItems } from "../api/itemApi";
import { useQuery } from "@tanstack/react-query";

const useQueryAllItems = () => {
  return useQuery({
    queryKey: ["allItems"],
    queryFn: getAllItems,
  });
};

export default useQueryAllItems;
