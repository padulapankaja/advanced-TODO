import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "../../types/todoTypes";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Disable previous button if on first page
  const isPreviousDisabled = currentPage <= 1;

  // Disable next button if on last page
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPreviousDisabled}
        className={`
          flex items-center justify-center 
          w-10 h-10 rounded-full 
          ${
            isPreviousDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }
          transition-colors duration-200
        `}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="text-sm font-medium text-gray-700">
        <span data-testid="page-text">Page</span>{" "}
        <span className="font-bold" data-testid="current-page">
          {currentPage}
        </span>{" "}
        <span data-testid="of-text">of</span>{" "}
        <span data-testid="total-pages">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        className={`
          flex items-center justify-center 
          w-10 h-10 rounded-full 
          ${
            isNextDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }
          transition-colors duration-200
        `}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
