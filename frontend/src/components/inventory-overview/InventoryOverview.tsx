import React, { Fragment } from "react";
import { Categories, SearchItems } from "../../types/api";
import InventoryOverviewEntry from "./InventoryOverviewEntry";

interface Props {
  categoriesLoading: boolean;
  categories: Categories | undefined;
  allItemsLoading: boolean;
  allItems: SearchItems | undefined;
}

function InventoryOverview({
  categoriesLoading,
  categories,
  allItemsLoading: filteredItemsLoading,
  allItems: filteredItems,
}: Props) {
  return (
    <Fragment>
      {!categoriesLoading &&
        !filteredItemsLoading &&
        categories &&
        filteredItems && (
          <div className="bg-white p-6 rounded-md flex flex-col">
            <span className="text-sm font-semibold">Inventory Overview</span>
            <div className="flex gap-28 mt-5">
              <InventoryOverviewEntry
                title={"Total Categories"}
                value={categories.categories.length}
                icon={"category-icon"}
              />
              <InventoryOverviewEntry
                title={"Total Items"}
                value={filteredItems.items.length}
                icon={"item-icon"}
              />
            </div>
          </div>
        )}
    </Fragment>
  );
}

export default InventoryOverview;
