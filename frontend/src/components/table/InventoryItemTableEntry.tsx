import React from "react";

interface Props {
  content: string | number | undefined;
}

function InventoryItemTableEntry({ content }: Props) {
  return (
    <td className="p-4 pl-6 text-sm border-b border-slate-200">{content}</td>
  );
}

export default InventoryItemTableEntry;
