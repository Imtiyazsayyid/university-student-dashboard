import React from "react";

const EmptyState = () => {
  return (
    <div className="dark:bg-[#151515] px-4 py-10 sm:px-6 lg:px-10 h-[933px] flex justify-center items-center overflow-hidden bg-gray-100">
      <div className="flex flex-col text-center items-center">
        <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
