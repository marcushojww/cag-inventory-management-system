import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className="min-h-[100dvh] min-w-[100dvw] h-dvh w-dvw flex flex-col">
      {/* HEADER */}
      <div className="flex items-center shadow-md p-5 z-10">
        <div className="bg-cag-logo bg-no-repeat bg-contain h-8 w-12 mr-4"></div>
        <span className="text-sm font-medium">INVENTORY MANAGEMENT SYSTEM</span>
      </div>
      {/* CONTENT */}
      <div className="w-full h-[calc(100%-72px)] max-h-[calc(100%-72px)] overflow-y-scroll flex flex-col items-center bg-slate-200">
        {children}
      </div>
    </div>
  );
}

export default Layout;
