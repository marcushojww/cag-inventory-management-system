import React from "react";
import { AggregatedItemByCategory } from "../../types/api";

interface Props {
  item: AggregatedItemByCategory;
}

function CategoryOverviewEntry({ item }: Props) {
  return (
    <div className="flex flex-col mt-5">
      <span className="text-sm font-medium mb-2">{item.category}</span>
      <div className="flex justify-between  border-y-[1px] py-2">
        <span className="text-xs">Total Price</span>
        <span className="text-xs">{item.total_price}</span>
      </div>
      <div className="flex justify-between border-b-[1px] py-2">
        <span className="text-xs">Total Count</span>
        <span className="text-xs">{item.count}</span>
      </div>
    </div>
  );
}

export default CategoryOverviewEntry;
