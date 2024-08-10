import { getCategories } from "../api/itemApi";
import { useQuery } from "@tanstack/react-query";

const useQueryCategories = () => {
  return useQuery({
    queryKey: ["distinctCategories"],
    queryFn: getCategories,
  });
};

export default useQueryCategories;
