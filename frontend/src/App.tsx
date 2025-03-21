/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  setTaskToDelete,
  cancelDeleteTask,
  confirmDeleteTask,
  setTaskToUpdate,
  cancelUpdateTask,
  confirmUpdateTask,
} from "./state/todo/todoSlice";
import {
  useCreateTodosMutation,
  useDeleteTodosMutation,
  useUpdateStatusTodosMutation,
  useSearchTodosQuery,
  useUpdateTodosMutation,
} from "./services/todoService";
import { Header } from "./components/index";
import TaskForm from "./components/Form";
import TaskCard from "./components/Card";
import ConfirmationModal from "./components/ConfirmationModel";
import FilterComponent from "./components/FilterComponent";
import { FormData } from "./types/todoTypes";
import { getNotificationMessage } from "./utils";
import TaskPopup from "./components/TaskPopup";

type DependentTask = {
  _id: string;
  title: string;
};
type Notification = {
  type: "error" | "success" | "warning"
  message: string;
};
const today = new Date().toISOString().split("T")[0];

const App = () => {
  const dispatch = useDispatch();
  const taskToDelete = useSelector((state: any) => state.todos?.taskToDelete);
  const taskToUpdate = useSelector((state: any) => state.todos?.taskToUpdate);

  // Mutations & Queries
  const [createTodos, { isSuccess: isCreated }] = useCreateTodosMutation();
  const [deleteTodos, { isSuccess: isDeleted }] = useDeleteTodosMutation();
  const [updateStatusTodos, { isSuccess: isStatusUpdate }] =
    useUpdateStatusTodosMutation();
  const [updateTodos] = useUpdateTodosMutation();

  const [searchParams, setSearchParams] = useState({});
  const {
    data: filteredTodos,
    error: filterError,
    isLoading: isFiltering,
    refetch,
  } = useSearchTodosQuery(searchParams);

  const [dependentRoot, setDependentRoot] = useState<DependentTask[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [completeAlert, setCompleteAlert] = useState(false);
  const [updateTask, setUpdateTask] = useState(false);

  const [notification, setNotification] = useState<Notification>();

  
  // incomplete tasks
  const inCompletedTasks = useMemo(
    () =>
      filteredTodos?.tasks.filter(
        (task: any) =>
          task.status === "notDone" && task.dueDate.split("T")[0] >= today
      ) || [],
    [filteredTodos]
  );

  // Function to trigger notification and clear it after 2 seconds
const triggerNotification = (type: "error" | "success" | "warning", message: string) => {
  setNotification({ type, message });
  setTimeout(() => {
    setNotification(undefined);
  }, 2000);
};

useEffect(() => {
  if (isCreated) triggerNotification("success", "Task created successfully!");
  if (isDeleted) triggerNotification("warning", "Task deleted successfully!");
  if (isStatusUpdate) triggerNotification("success", "Task updated successfully!");
}, [isCreated, isDeleted, isStatusUpdate]);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        const todoData = {
          title: data.title,
          status: "notDone",
          priority: data.priority,
          dueDate: data.dueDate,
          isRecurring: data.isRecurrent,
          recurrencePattern: data.isRecurrent
            ? data.recurrencePattern
            : undefined,
          isDependency: data.isDependent,
          dependencies: data.isDependent
            ? Array.isArray(data.dependencies)
              ? data.dependencies
              : [data.dependencies]
            : [],
        };

        await createTodos(todoData).unwrap();
        setSearchParams({});
        refetch();
      } catch (err: any) {
        console.error("Failed to create task:", err);
      }
    },
    [createTodos, refetch]
  );

  const handleDelete = useCallback(async () => {
    try {
      if (taskToDelete?._id) {
        await deleteTodos(taskToDelete._id).unwrap();
        dispatch(confirmDeleteTask());
        setDeleteConfirmation(false);
        refetch();
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }, [taskToDelete, deleteTodos, dispatch, refetch]);

  const handleComplete = useCallback(
    async (task: FormData) => {
      try {
        setCompleteAlert(false);
        if (task.dependencies?.some((dep: FormData) => dep.status !== "done")) {
          setCompleteAlert(true);
          return;
        }
        await updateStatusTodos({ id: task._id, status: "done" }).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to update task status:", err);
      }
    },
    [updateStatusTodos, refetch]
  );

  const handleFilterApply = useCallback((filters: any) => {
    setSearchParams(filters);
  }, []);

  const deleteTaskConfirmation = useCallback(
    (task: FormData) => {
      setDependentRoot([]);
      dispatch(setTaskToDelete(task));
      setDeleteConfirmation(true);

      const tasksWithDependency =
        filteredTodos?.tasks
          .filter((t: any) =>
            t.dependencies.some((dep: any) => dep._id === task._id)
          )
          .map((t: any) => ({ _id: t._id, title: t.title })) || [];

      if (tasksWithDependency.length > 0) {
        setDependentRoot(tasksWithDependency);
      }
    },
    [filteredTodos, dispatch]
  );
  const updateTaskConfirmation = useCallback(
    (task: FormData) => {
      dispatch(setTaskToUpdate(task));
      setUpdateTask(true);
    },
    [dispatch]
  );

  const handleUpdateTask = useCallback(
    async (task: FormData) => {
      try {
        const todoData = {
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          isRecurring: task.isRecurrent,
          recurrencePattern: task.isRecurrent
            ? task.recurrencePattern
            : undefined,
          isDependency: task.isDependent,
          dependencies: task.isDependent
            ? Array.isArray(task.dependencies)
              ? task.dependencies
              : [task.dependencies]
            : [],
        };
        setUpdateTask(false);
        await updateTodos({ id: taskToUpdate._id, todoData }).unwrap();
        dispatch(confirmUpdateTask());
        refetch();
      } catch (err) {
        console.error("Failed to update task status:", err);
      }
    },
    [updateTodos, dispatch, taskToUpdate, refetch]
  );

  if (isFiltering) return <p>Loading...</p>;
  if (filterError) return <p>Error: {JSON.stringify(filterError)}</p>;

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 p-4">
          {notification && getNotificationMessage(notification.type, notification.message)}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-0 m-0">
            <TaskForm
              onSubmit={handleSubmit}
              inCompleted={inCompletedTasks}
              description="Task creation form"
              title="Please fill details to create a new task"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <FilterComponent
            onFilterApply={handleFilterApply}
            taskStats={filteredTodos?.stat}
          />
        </div>
      </div>

      <div className="border-t-6 border-gray-200 h-1 m-4"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTodos?.tasks.map((task: any) => (
          <TaskCard
            task={task}
            key={task._id}
            onDelete={deleteTaskConfirmation}
            onComplete={handleComplete}
            onUpdate={updateTaskConfirmation}
          />
        ))}
      </div>

      {deleteConfirmation && (
        <ConfirmationModal
          open
          onCancel={() => {
            setDeleteConfirmation(false);
            dispatch(cancelDeleteTask());
          }}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete task: ${taskToDelete?.title}`}
          title="Delete Task"
          option1="Cancel"
          option2="Delete"
          dependentTasks={dependentRoot}
        />
      )}

      {completeAlert && (
        <ConfirmationModal
          open
          onCancel={() => setCompleteAlert(false)}
          onConfirm={() => setCompleteAlert(false)}
          message="Please complete all dependent tasks related to this task."
          title="Complete Task"
          option1="Okay"
          option2=""
          dependentTasks={[]}
        />
      )}
      {updateTask && (
        <TaskPopup
          open
          key={"1"}
          onCancel={() => {
            setUpdateTask(false);
            dispatch(cancelUpdateTask());
          }}
          onSubmit={handleUpdateTask}
          inCompleted={inCompletedTasks}
        />
      )}
    </>
  );
};

export default App;
