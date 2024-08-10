import React from "react";

interface Props {
  title: string;
  value: number;
  icon: string;
}

function InventoryOverviewEntry({ title, value, icon }: Props) {
  return (
    <div className="flex items-center">
      {icon === "item-icon" && (
        <div
          className={`bg-item-icon bg-no-repeat bg-contain h-8 w-8 mr-4`}
        ></div>
      )}
      {icon === "category-icon" && (
        <div
          className={`bg-category-icon bg-no-repeat bg-contain h-8 w-8 mr-4`}
        ></div>
      )}
      <div className="flex flex-col">
        <span className="text-xs">{title}</span>
        <span className="text-xl">{value}</span>
      </div>
    </div>
  );
}

export default InventoryOverviewEntry;
