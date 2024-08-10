import React, { Fragment, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Select, {
  ActionMeta,
  GroupBase,
  OnChangeValue,
  OptionsOrGroups,
} from "react-select";
import useFilterItems from "../../hooks/useFilterItems";
import { Categories, SearchRequest } from "../../types/api";
import InventoryItemTableHeader from "./InventoryItemTableHeader";
import InventoryItemTableEntry from "./InventoryItemTableEntry";
import { Item } from "../../types/item";

interface Props {
  categories: Categories | undefined;
  categoriesLoading: boolean;
}

interface Option {
  label: string;
  value: string;
}

function InventoryItemTable({ categories, categoriesLoading }: Props) {
  const queryClient = useQueryClient();
  const [filterPayload, setFilterPayload] = useState<SearchRequest>();
  const { data: filteredItems, isPending: filteredItemsLoading } =
    useFilterItems(filterPayload);
  const [items, setItems] = useState<Item[]>();
  const tableHeaders = ["Name", "Category", "Price", "Last Updated On"];
  const defaultOption: Option = { value: "All", label: "All" };

  const handleCreateSelectOptions = (
    categories: string[]
  ): OptionsOrGroups<Option, GroupBase<Option>> | undefined => {
    let options = [defaultOption];
    for (let category of categories) {
      options.push({
        value: category,
        label: category,
      });
    }
    return options;
  };

  const handleSelectClick = (
    option: OnChangeValue<Option, false>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (option?.value) {
      if (option.value === "All") {
        setFilterPayload(undefined);
      } else {
        setFilterPayload({
          category: option.value,
        });
      }
    }
  };

  const handleSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (items && filteredItems) {
      if (e.currentTarget.value === "") {
        setItems(filteredItems.items);
      } else {
        let filteredSearchItems: Item[] = items.filter(
          (item) =>
            item.name
              .toLowerCase()
              .includes(e.currentTarget.value.toLowerCase()) ||
            item.category
              .toLowerCase()
              .includes(e.currentTarget.value.toLowerCase())
        );
        setItems(filteredSearchItems);
      }
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["filteredItems"] });
  }, [filterPayload, queryClient]);

  useEffect(() => {
    if (!filteredItemsLoading && filteredItems) setItems(filteredItems.items);
  }, [filteredItems, filteredItemsLoading]);

  return (
    <Fragment>
      {!filteredItemsLoading && !categoriesLoading && items && categories && (
        <div className="flex flex-col">
          {/* SEARCH AND FILTER SELECT */}
          <div className="flex items-center gap-5">
            {/* INPUT */}
            <div className="w-96">
              <input
                type="text"
                className="py-2 px-2 border-solid border-[1px] text-sm w-full mt-1 focus:outline-none"
                placeholder="Filter items by name or category"
                onChange={(e) => handleSearchInput(e)}
              ></input>
            </div>
            <div className="w-48 mb-[-4px]">
              <Select
                defaultValue={defaultOption}
                options={handleCreateSelectOptions(categories.categories)}
                onChange={handleSelectClick}
              />
            </div>
          </div>
          {/* TABLE */}
          <table className="table-fixed bg-white rounded-md mt-5">
            <thead>
              <tr className="border-b border-slate-200">
                {tableHeaders.map((header) => (
                  <InventoryItemTableHeader header={header} key={header} />
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <InventoryItemTableEntry
                    content={item.name}
                  ></InventoryItemTableEntry>
                  <InventoryItemTableEntry
                    content={item.category}
                  ></InventoryItemTableEntry>
                  <InventoryItemTableEntry
                    content={item.price}
                  ></InventoryItemTableEntry>
                  <InventoryItemTableEntry
                    content={item.last_updated_dt}
                  ></InventoryItemTableEntry>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
}

export default InventoryItemTable;
