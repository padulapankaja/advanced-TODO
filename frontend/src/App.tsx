/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Header } from "./components/index";
import TaskForm from "./components/Form";
import {
  useGetTodosQuery,
  useCreateTodosMutation,
} from "./services/todoService";
import TaskCard from "./components/Card";

type FormData = {
  title: string;
  priority: string;
  dueDate: string;
  isRecurrent: boolean;
  isDependent: boolean;
  recurrencePattern?: string;
  dependencies?: string;
};

function App() {
  const { data: todos, error, isLoading, refetch } = useGetTodosQuery({});
  const [createTodo, { isLoading: isCreating, isSuccess: isCreated }] =
    useCreateTodosMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [inCompletedTasks, setInCompletedTasks] = useState<any[]>([]);
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
      console.log(todoData);
      await createTodo(todoData).unwrap();
      refetch();
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setFormError(err.message || "Failed to create task. Please try again.");
    }
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  // TODO: Need to add spinner for creating task
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
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          inCompleted={inCompletedTasks}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos?.map((task: any) => (
          <TaskCard task={task} key={task._id} />
        ))}
      </div>
    </>
  );
}

export default App;
