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
  useGetTodosQuery,
  useCreateTodosMutation,
  useDeleteTodosMutation,
  useUpdateStatusTodosMutation,
} from "./services/todoService";
import TaskCard from "./components/Card";
import ConfirmationModal from "./components/ConfirmationModel";
import { FormData } from "./types/todoTypes";
type dependentTask = {
  _id: string;
  title: string;
};
function App() {
  const dispatch = useDispatch();
  const taskToDelete = useSelector((state: any) => state.todos?.taskToDelete);
  const { data: todos, error, isLoading, refetch } = useGetTodosQuery({});
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
  useEffect(() => {
    setInCompletedTasks(
      todos?.filter(
        (task: any) =>
          task.status === "not done" && task.dueDate >= new Date().toISOString()
      )
    );
  }, [todos]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  const handleSubmit = async (data: FormData) => {
    try {
      setFormError(null);

      const todoData = {
        title: data.title,
        status: "not done",
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
      const tasksWithDependency = todos
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

  if (isCreating) {
    return <p>Creating...</p>;
  }
  return (
    <>
      <Header />

      <div className="p-4 sm:p-6">
        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {formError}
          </div>
        )}
        {isCreated && (
          <div className="mb-4 p-3 bg-green-200 text-green-900 rounded-md">
            Task created successfully!
          </div>
        )}
        {isDeleted && (
          <div className="mb-4 p-3 bg-yellow-200 text-yellow-900 rounded-md">
            Task deleted successfully!
          </div>
        )}
        {isStatusUpdate && (
          <div className="mb-4 p-3 bg-green-200 text-green-900 rounded-md">
            Task updated successfully!
          </div>
        )}
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          inCompleted={inCompletedTasks}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos?.map((task: any) => (
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
