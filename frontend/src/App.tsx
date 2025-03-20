/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import {
  setTaskToDelete,
  cancelDeleteTask,
  confirmDeleteTask,
} from "./state/todo/todoSlice";
import { useEffect, useState } from "react";
import { Header } from "./components/index";
import TaskForm from "./components/Form";
import {
  useCreateTodosMutation,
  useDeleteTodosMutation,
  useUpdateStatusTodosMutation,
  useSearchTodosQuery,
} from "./services/todoService";
import TaskCard from "./components/Card";
import ConfirmationModal from "./components/ConfirmationModel";
import { FormData } from "./types/todoTypes";
import FilterComponent from "./components/FilterComponent";
import { getNotificationMessage } from "./utils";
type dependentTask = {
  _id: string;
  title: string;
};
function App() {
  const dispatch = useDispatch();
  const taskToDelete = useSelector((state: any) => state.todos?.taskToDelete);
  // const { data: todos, error, isLoading } = useGetTodosQuery({});
  const [createTodos, { isLoading: isCreating, isSuccess: isCreated }] =
    useCreateTodosMutation();
  const [deleteTodos, { isSuccess: isDeleted }] = useDeleteTodosMutation();
  const [updateStatusTodos, { isSuccess: isStatusUpdate }] =
    useUpdateStatusTodosMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [inCompletedTasks, setInCompletedTasks] = useState<any[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [dependentRoot, setDependentRoot] = useState<dependentTask[]>();
  const [completeAlert, setCompleteAlert] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>({});
  const {
    data: filteredTodos,
    error: filterError,
    isLoading: isFiltering,
    refetch,
  } = useSearchTodosQuery(searchParams);

  useEffect(() => {
    setInCompletedTasks(
      filteredTodos?.tasks.filter(
        (task: any) =>
          task.status === "notDone" && task.dueDate >= new Date().toISOString()
      )
    );
  }, [filteredTodos]);

  if (isFiltering) {
    return <p>Loading...</p>;
  }

  if (filterError) {
    return <p>Error: {JSON.stringify(filterError)}</p>;
  }

  const handleSubmit = async (data: FormData) => {
    try {
      setFormError(null);

      const todoData = {
        title: data.title,
        status: "notDone",
        priority: data.priority,
        dueDate: data.dueDate,
        isRecurring: data.isRecurrent,
        recurrencePattern: data.recurrencePattern,
        isDependency: data.isDependent,
        dependencies:
          data.isDependent && data.dependencies
            ? Array.isArray(data.dependencies)
              ? data.dependencies
              : [data.dependencies]
            : [],
      };
      if (todoData.isRecurring === false) delete todoData.recurrencePattern;
      await createTodos(todoData).unwrap();
      setSearchParams({});
      refetch();
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setFormError(err.message || "Failed to create task. Please try again.");
    }
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  const deleteTaskConfirmation = async (task: FormData) => {
    try {
      setDependentRoot([]);
      dispatch(setTaskToDelete(task));
      setDeleteConfirmation(true);
      const tasksWithDependency = filteredTodos.tasks
        .filter((t: any) =>
          t.dependencies.some((dep: any) => dep._id === task._id)
        )
        .map((t: any) => ({ _id: t._id, title: t.title }));
      if (tasksWithDependency.length > 0) {
        setDependentRoot(tasksWithDependency);
      }
    } catch (err: any) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleDelete = async () => {
    try {
      if (taskToDelete && taskToDelete._id) {
        await deleteTodos(taskToDelete._id).unwrap();
        dispatch(confirmDeleteTask());
        refetch();
        setDeleteConfirmation(false);
      }
    } catch (err: any) {
      setDeleteConfirmation(false);
      console.error("Failed to delete task:", err);
    }
  };

  const handleComplete = async (task: FormData) => {
    try {
      setCompleteAlert(false);
      if (task.dependencies && task.dependencies.length > 0) {
        const com = task.dependencies.every(
          (dep: FormData) => dep.status === "done"
        );
        if (!com) {
          setCompleteAlert(true);
          return;
        }
      }
      await updateStatusTodos({ id: task._id, status: "done" }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };
  const handleFilterApply = (filters: any) => {
    setSearchParams(filters);
  };

  if (isCreating) {
    return <p>Creating...</p>;
  }
  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 p-4">
          {formError && getNotificationMessage("error", formError)}
          {isCreated &&
            getNotificationMessage("success", "Task created successfully!")}
          {isDeleted &&
            getNotificationMessage("warning", "Task deleted successfully!")}
          {isStatusUpdate &&
            getNotificationMessage("success", "Task updated successfully!")}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-0 m-0">
            <TaskForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              inCompleted={inCompletedTasks}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <FilterComponent
            onFilterApply={handleFilterApply}
            taskStats={{
              totalTasks: filteredTodos && filteredTodos.stat.totalTasks,
              completedTasks:
                filteredTodos && filteredTodos.stat.completedTasks,
              incompleteTasks:
                filteredTodos && filteredTodos.stat.incompleteTasks,
            }}
          />
        </div>
      </div>
      <div className="border-t-6 border-gray-200 h-1 m-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTodos &&
          filteredTodos.tasks.map((task: any) => (
            <TaskCard
              task={task}
              key={task._id}
              onDelete={deleteTaskConfirmation}
              onComplete={handleComplete}
            />
          ))}
      </div>
      {deleteConfirmation && (
        <ConfirmationModal
          open={true}
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
          open={true}
          onCancel={() => setCompleteAlert(false)}
          onConfirm={() => setCompleteAlert(false)}
          message={`Please complete all dependent tasks related to this task`}
          title="Complete Task"
          option1="Okay"
          option2=""
          dependentTasks={[]}
        />
      )}
    </>
  );
}

export default App;
