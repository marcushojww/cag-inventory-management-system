import React from "react";

interface Props {
  header: string;
}

function InventoryItemTableHeader({ header }: Props) {
  return (
    <th className="p-4 pl-6  text-sm text-left font-semibold min-w-[250px]">
      {header}
    </th>
  );
}

export default InventoryItemTableHeader;
