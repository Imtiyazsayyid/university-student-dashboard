import React from "react";

const SideBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="xl:h-[824px] lg:h-[680px]">
      {/* desktopSidebar */}
      {/* MobileSidebar */}
      <main className="h-full">{children}</main>
    </div>
  );
};

export default SideBar;
