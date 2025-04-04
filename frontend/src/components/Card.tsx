import React from "react";
import { TaskStatus, TaskCardProps, FormData } from "../types/todoTypes";
import {
  completedBackground,
  getCardBorder,
  getPriorityColor,
} from "../util/util";

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onDelete,
  onUpdate,
  onReopen,
}) => {
  const {
    title,
    priority,
    isRecurring,
    isDependency,
    recurrencePattern,
    dependencies,
    status,
  } = task;

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
  const handleReopen = () => {
    if (onReopen) {
      onReopen(task);
    }
  };

  return (
    <div
      className={`${completedBackground(
        status.toString() as TaskStatus
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
                  {dependencies.map((dep: FormData) => (
                    <span
                      key={dep._id}
                      className={`${completedBackground(
                        dep.status.toString() as TaskStatus
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
          {status === "done" && (
            <button
              onClick={handleReopen}
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
              Reopen
            </button>
          )}
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
