/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from "./components/index";
import TaskForm from "./components/Form";
import { useGetTodosQuery } from './services/todoService'
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }


  const handleSubmit = (data: FormData) => {
    console.log(data);
    refetch();
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    
  };

  return (
    <>
      <Header />
      <div className="p-4 sm:p-6">
        <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <div>
      <ul>
        {todos?.map((task:any) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default App;
