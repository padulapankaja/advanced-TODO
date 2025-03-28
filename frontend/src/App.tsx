import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  setTaskToDelete,
  confirmDeleteTask,
  setTaskToUpdate,
  confirmUpdateTask,
} from "./state/todo/todoSlice";
import {
  useCreateTodosMutation,
  useDeleteTodosMutation,
  useUpdateStatusTodosMutation,
  useSearchTodosQuery,
  useUpdateTodosMutation,
} from "./services/todoService";
import Header from "./components/Header";
import TaskForm from "./components/Form";
import TaskCard from "./components/Card";
import ConfirmationModal from "./components/ConfirmationModel";
import FilterComponent from "./components/FilterComponent";
import Pagination from "./components/Shared/Pagination";
import TaskPopup from "./components/TaskPopup";
import { getNotificationMessage } from "./utils";
import { AppDispatch, RootState } from "./state/store";
import {
  FormData,
  DependentTask,
  Filters,
  Notification,
  NotificationType,
} from "./types/todoTypes";
import ErrorBoundary from './components/ErrorBoundry';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(3);

  // Global State
  const taskToDelete = useSelector(
    (state: RootState) => state.todos?.taskToDelete
  );
  const taskToUpdate = useSelector(
    (state: RootState) => state.todos?.taskToUpdate
  );

  // API Mutations & Queries
  const [createTodos, { isSuccess: isCreated }] = useCreateTodosMutation();
  const [deleteTodos, { isSuccess: isDeleted }] = useDeleteTodosMutation();
  const [updateStatusTodos, { isSuccess: isStatusUpdate }] =
    useUpdateStatusTodosMutation();
  const [updateTodos] = useUpdateTodosMutation();

  // UI States
  const [searchParams, setSearchParams] = useState({});
  const [dependentRoot, setDependentRoot] = useState<DependentTask[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [completeAlert, setCompleteAlert] = useState(false);
  const [updateTask, setUpdateTask] = useState(false);
  const [notification, setNotification] = useState<Notification>();

  // Fetch filtered todos
  const {
    data: filteredTodos,
    error: filterError,
    isLoading: isFiltering,
    refetch,
  } = useSearchTodosQuery(searchParams);

  // Incomplete Tasks
  const inCompletedTasks = useMemo(
    () =>
      filteredTodos?.tasks.filter(
        (task: FormData) => task.status === "notDone"
      ) || [],
    [filteredTodos]
  );

  // Notification Handler
  const triggerNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(undefined), 2000);
  };

  // Effect to show notifications
  useEffect(() => {
    if (isCreated) triggerNotification("success", "Task created successfully!");
    if (isDeleted) triggerNotification("warning", "Task deleted successfully!");
    if (isStatusUpdate)
      triggerNotification("success", "Task updated successfully!");
  }, [isCreated, isDeleted, isStatusUpdate]);

  // Handle Task Creation
  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        const todoData = {
          ...data,
          status: "notDone",
          recurrencePattern: data.isRecurrent
            ? data.recurrencePattern
            : undefined,
          dependencies: data.isDependent
            ? Array.isArray(data.dependencies)
              ? data.dependencies
              : [data.dependencies]
            : [],
        };

        await createTodos(todoData).unwrap();
        setSearchParams({});
        refetch();
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    },
    [createTodos, refetch]
  );

  // Handle Task Deletion
  const handleDelete = useCallback(async () => {
    if (!taskToDelete?._id) return;
    try {
      await deleteTodos(taskToDelete._id).unwrap();
      dispatch(confirmDeleteTask());
      setDeleteConfirmation(false);
      refetch();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }, [taskToDelete, deleteTodos, dispatch, refetch]);

  // Handle Task Completion
  const handleComplete = useCallback(
    async (task: FormData) => {
      if (task.dependencies?.some((dep: FormData) => dep.status !== "done")) {
        setCompleteAlert(true);
        return;
      }
      try {
        await updateStatusTodos({ id: task._id, status: "done" }).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to update task status:", err);
      }
    },
    [updateStatusTodos, refetch]
  );

  // Handle Filters
  const handleFilterApply = useCallback((filters: Filters) => {
    setSearchParams(filters);
  }, []);

  // Confirm Task Deletion
  const deleteTaskConfirmation = useCallback(
    (task: FormData) => {
      setDependentRoot([]);
      dispatch(setTaskToDelete(task));
      setDeleteConfirmation(true);

      const tasksWithDependency =
        filteredTodos?.tasks
          .filter((t: FormData) =>
            t.dependencies?.some((dep: FormData) => dep._id === task._id)
          )
          .map((t: FormData) => ({ _id: t._id, title: t.title })) || [];

      if (tasksWithDependency.length > 0) {
        setDependentRoot(tasksWithDependency);
      }
    },
    [filteredTodos, dispatch]
  );

  // Confirm Task Update
  const updateTaskConfirmation = useCallback(
    (task: FormData) => {
      dispatch(setTaskToUpdate(task));
      setUpdateTask(true);
    },
    [dispatch]
  );

  // Handle Task Update
  const handleUpdateTask = useCallback(
    async (task: FormData) => {
      try {
        const todoData = {
          ...task,
          recurrencePattern: task.isRecurrent
            ? task.recurrencePattern
            : undefined,
          dependencies: task.isDependent
            ? Array.isArray(task.dependencies)
              ? task.dependencies
              : [task.dependencies]
            : [],
        };
        setUpdateTask(false);
        await updateTodos({ id: taskToUpdate?._id, todoData }).unwrap();
        dispatch(confirmUpdateTask());
        refetch();
      } catch (err) {
        console.error("Failed to update task status:", err);
      }
    },
    [updateTodos, dispatch, taskToUpdate, refetch]
  );

  // Pagination Handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      setSearchParams((prev) => ({
        ...prev,
        page: newPage,
        limit: pageLimit,
      }));
    },
    [pageLimit]
  );

  const AppErrorFallback = () => (
    <div className="p-4 bg-red-100 text-red-800 rounded-md">
      <h2 className="text-xl font-bold mb-2">Oops! Something went wrong with the Todo App.</h2>
      <p>We're unable to load your tasks right now. Please try refreshing the page or contact support.</p>
      <button 
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );

  if (isFiltering) return <p>Loading...</p>;
  if (filterError) return <p>Error: {JSON.stringify(filterError)}</p>;

  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
    <>
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 p-4">
          {notification &&
            getNotificationMessage(notification.type, notification.message)}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-0 m-0">
            <TaskForm
              onSubmit={handleSubmit}
              inCompleted={inCompletedTasks}
              description="Task creation form"
              title="Please fill details to create a new task"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <FilterComponent
            onFilterApply={handleFilterApply}
            taskStats={filteredTodos?.stat}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTodos?.tasks.map((task: FormData) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={deleteTaskConfirmation}
            onComplete={handleComplete}
            onUpdate={updateTaskConfirmation}
          />
        ))}
      </div>
      {filteredTodos?.pagination?.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={filteredTodos.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {deleteConfirmation && (
        <ConfirmationModal
          open
          onCancel={() => setDeleteConfirmation(false)}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete task: ${taskToDelete?.title}`}
          title="Delete Task"
          dependentTasks={dependentRoot}
          option1="Cancel"
          option2="Delete"
        />
      )}

      {completeAlert && (
        <ConfirmationModal
          option1="Okay"
          option2=""
          open
          onCancel={() => setCompleteAlert(false)}
          message="Please complete all dependent tasks before proceeding."
          title="Complete Task"
        />
      )}

      {updateTask && (
        <TaskPopup
          open
          onCancel={() => setUpdateTask(false)}
          onSubmit={handleUpdateTask}
          inCompleted={inCompletedTasks}
        />
      )}
    </>
    </ErrorBoundary>
  );
};

export default App;
