import { Header } from "./components/index";
import TaskForm from "./components/Form";

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
  const handleSubmit = (data: FormData) => {
    console.log(data);
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
    </>
  );
}

export default App;
