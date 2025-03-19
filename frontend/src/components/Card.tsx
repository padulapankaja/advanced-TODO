/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type FormData = {
  title: string;
  priority: string;
  dueDate: string;
  isRecurring: boolean;
  isDependency: boolean;
  recurrencePattern?: string;
  dependencies?: object[];
  status: string;
};

interface TaskCardProps {
  task: FormData;
  onComplete?: (task: FormData) => void;
  onDelete?: (task: FormData) => void;
  onUpdate?: (task: FormData) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onDelete,
  onUpdate,
}) => {
  const {
    title,
    priority,
    dueDate,
    isRecurring,
    isDependency,
    recurrencePattern,
    dependencies,
    status,
  } = task;

  // Function to determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getCardBorder = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "border-red-300";
      case "medium":
        return "border-yellow-300";
      case "low":
        return "border-green-300";
      default:
        return "border-gray-300";
    }
  };
  const completedBackground = (status: string) => {
    switch (status.toLowerCase()) {
      case "not done":
        return "bg-[#f7f7f7]";
      case "done":
        return "bg-[#f1fff1]";
      default:
        return "bg-[#f7f7f7]";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  const truncTitle = (title: string) => {
    return title.length > 40 ? title.slice(0, 40) + "..." : title;
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task);
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(task);
    }
  };

  return (
    <div
      className={`${completedBackground(
        status
      )} rounded-md shadow-md p-4 m-4 border-l-4 ${getCardBorder(priority)}`}
    >
      <div className="flex h-full justify-between flex-col">
        <div>
          <div className="flex justify-between  items-center">
            <h3 className="font-bold text-lg text-gray-800">
              {truncTitle(title)}
            </h3>
            <div>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(
                  priority
                )}`}
              >
                {priority}
              </span>
              {status === "done" && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ml-2 bg-[#3bb41d3b]`}
                >
                  completed
                </span>
              )}
            </div>
          </div>

          <div className="flex mt-3 text-sm text-gray-600 ">
            <div className="flex items-center mr-4">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span>Due: {formatDate(dueDate)}</span>
            </div>

            <div className="flex">
              {isRecurring && (
                <div className="flex items-center mt-1">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  <span>Recurrent: {recurrencePattern}</span>
                </div>
              )}
            </div>
          </div>
          {isDependency && dependencies && dependencies?.length > 0 && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <div>
                <div className="flex items-center mb-1">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    ></path>
                  </svg>
                  <span>Depends on:</span>
                </div>
                <div className="flex flex-wrap">
                  {dependencies.map((dep: any) => (
                    <span
                      key={dep._id}
                      className={`${completedBackground(
                        dep.status
                      )} rounded-md px-2 w-full py-1 text-xs font-medium m-1 border-l-2 text-black ${getCardBorder(
                        dep.priority
                      )}`}
                    >
                      {truncTitle(dep.title)}
                      <span
                        className={`px-1 ml-2 rounded-xs py-0.5 text-xs font-medium ${getPriorityColor(
                          priority
                        )}`}
                      >
                        {priority}
                      </span>

                      {dep.status === "done" && (
                        <span
                          className={`px-1  rounded-xs py-0.5 text-xs font-medium ml-2 bg-[#3bb41d3b]`}
                        >
                          completed
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleDelete}
            className="flex items-center px-2 py-1 text-xs font-medium text-white bg-red-800 rounded-md hover:bg-red-600 transition-colors"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Delete
          </button>
          {status !== "done" && (
            <>
              <button
                onClick={handleUpdate}
                className="flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-800 rounded-md hover:bg-blue-600 transition-colors"
              >
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Update
              </button>
              <button
                onClick={handleComplete}
                className="flex items-center px-2 py-1 text-xs font-medium text-white bg-green-800 rounded-md hover:bg-green-600 transition-colors"
              >
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
