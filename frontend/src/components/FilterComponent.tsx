import React, { useState } from "react";
import Button from "./Shared/Button";
import StatCard from "./Shared/StatCard";
import { TaskStatus, PriorityKey, FilterType} from '../types/todoTypes'
type Filters = {
  status: Record<TaskStatus, boolean>;
  priority: Record<PriorityKey, boolean>;
};
type FilterOptions = {
  status: string[];
  priority: string[];
};
type taskStatsType = {
  totalTasks?: number;
  completedTasks?: number;
  incompleteTasks?: number;
}
interface FilterProps {
  onFilterApply: (filters: FilterOptions) => void;
  taskStats: taskStatsType;
}

const FilterComponent: React.FC<FilterProps> = ({
  onFilterApply,
  taskStats,
}) => {
  const {
    totalTasks = 0,
    completedTasks = 0,
    incompleteTasks = 0,
  } = taskStats || {};

  // State to hold the selected filters
  const [filters, setFilters] = useState<Filters>({
    status: { done: false, notDone: false },
    priority: { low: false, medium: false, high: false },
  });
  // Handle change in filter checkbox values
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const [filterType, filterValue] = name.split(".") as [FilterType, TaskStatus | PriorityKey];
  
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: {
        ...prevFilters[filterType],
        [filterValue]: checked,
      },
    }));
  };
  // Handle the filter apply button click
  const handleFilterSubmit = () => {
    const selectedStatus: string[] = Object.keys(filters.status).filter(
      (status) => filters.status[status as keyof typeof filters.status]
    );
    const selectedPriority:string[] = Object.keys(filters.priority).filter(
      (priority) => filters.priority[priority as keyof typeof filters.priority]
    );
    // Pass selected filters to the parent
    onFilterApply({
      status: selectedStatus,
      priority: selectedPriority,
    });

    console.log("Selected Filters: ", selectedStatus, selectedPriority);
  };

  const clearFilter = () => {
    onFilterApply({ status: [], priority: [] });
    setFilters({
      status: {
        done: false,
        notDone: false,
      },
      priority: {
        low: false,
        medium: false,
        high: false,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 m-4 sm:h-fit lg:h-100 ">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Task Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="bg-blue-50"
          />
          <StatCard
            title="Completed Tasks"
            value={completedTasks}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="bg-green-50"
          />
          <StatCard
            title="Incomplete Tasks"
            value={incompleteTasks}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="bg-yellow-50"
          />
        </div>
      </div>

      {/* Separator */}
      <div className="border-t-2 border-gray-200 m-3"></div>
      <h3 className="p-4 text-xl font-semibold text-gray-900">Apply Filters</h3>

      <div className="p-4 space-y-6 flex flex-col md:flex-row md:space-y-0 md:justify-between md:items-start">
        {/* Status Filters */}
        <div className="space-y-2 w-full md:w-auto">
          <h4 className="font-medium text-gray-700">Status</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="status.done"
                checked={filters.status.done}
                onChange={handleFilterChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Done</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="status.notDone"
                checked={filters.status.notDone}
                onChange={handleFilterChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Not Done</span>
            </label>
          </div>
        </div>

        {/* Priority Filters */}
        <div className="space-y-2 w-full md:w-auto">
          <h4 className="font-medium text-gray-700">Priority</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="priority.low"
                checked={filters.priority.low}
                onChange={handleFilterChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Low</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="priority.medium"
                checked={filters.priority.medium}
                onChange={handleFilterChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Medium</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="priority.high"
                checked={filters.priority.high}
                onChange={handleFilterChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">High</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col md:flex-col md:space-x-4 md:justify-between md:items-start my-auto">
          <Button onClick={clearFilter} size="medium" variant="secondary">
            Clear Filter
          </Button>
          <div className="h-4"></div>
          <Button onClick={handleFilterSubmit} size="medium">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
