import { Badge } from "@chakra-ui/react";
import React from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

interface Pagination {
  currentPage: number;
  itemsPerPage: number;
}

interface Props {
  itemCount: number;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  show?: boolean;
}

const MyPagination = ({ itemCount, pagination, setPagination, show = true }: Props) => {
  if (itemCount == 0 || !show) return null;

  const nextPage = () => {
    setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
  };

  const previousPage = () => {
    setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
  };

  if (Math.ceil(itemCount / pagination.itemsPerPage) < pagination.currentPage) {
    previousPage();
  }

  return (
    <div className="h-20 min-h-20 rounded-lg flex justify-center items-center px-5">
      <div>
        <div className="w-full justify-center flex items-center gap-2">
          <div className="w-28 flex justify-end cursor-pointer">
            {pagination.currentPage > 1 && (
              <Badge onClick={previousPage} p={2} px={4} rounded={"lg"}>
                <PiCaretLeftBold />
              </Badge>
            )}
          </div>

          <div>
            <Badge p={2} px={4} rounded={"lg"} colorScheme="purple">
              Page {pagination.currentPage} of {Math.ceil(itemCount / pagination.itemsPerPage)}
            </Badge>
          </div>

          <div className="w-28 flex justify-start cursor-pointer ">
            {itemCount > pagination.currentPage * pagination.itemsPerPage && (
              <Badge onClick={nextPage} p={2} px={4} rounded={"lg"}>
                <PiCaretRightBold />
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPagination;
