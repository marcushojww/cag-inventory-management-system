import React, { Fragment } from "react";
import CategoryOverviewEntry from "./CategoryOverviewEntry";
import useGetAggregatedItemsByCategory from "../../hooks/useGetAggregatedItemsByCategory";

function CategoryOverview() {
  const { data: aggregatedItems, isPending: loading } =
    useGetAggregatedItemsByCategory({
      category: "all",
    });

  return (
    <Fragment>
      {!loading && aggregatedItems && (
        <div className="bg-white p-6 rounded-md flex flex-col max-h-96 overflow-y-scroll">
          <span className="text-sm font-semibold">Category Overview</span>
          {aggregatedItems.items.map((item) => (
            <CategoryOverviewEntry item={item} key={item.category} />
          ))}
        </div>
      )}
    </Fragment>
  );
}

export default CategoryOverview;
