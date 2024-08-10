import React from "react";

interface Props {
  message: string;
}

function Alert({ message }: Props) {
  return (
    <div className="bg-red-100 p-5 flex gap- rounded-md">
      <div className="bg-exclamation-icon bg-no-repeat bg-contain h-8 w-8 mr-5"></div>
      <div className="flex flex-col">
        <span className="text-sm font-bold">Oops!</span>
        <span className="text-xs">{message}</span>
      </div>
    </div>
  );
}

export default Alert;
