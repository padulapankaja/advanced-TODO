/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from "@headlessui/react";
import { useSelector } from "react-redux";
import TaskForm from "./Form";
import { FormData } from "../types/todoTypes";

interface ConfirmationModalProps {
  open: boolean;
  inCompleted: FormData[];
  onCancel?: () => void;
  onSubmit: (task: FormData) => void;
}

export default function TaskPopup({
  open,
  onCancel,
  inCompleted,
  onSubmit,
}: ConfirmationModalProps) {
  const taskToDelete = useSelector((state: any) => state.todos?.taskToUpdate);

  const handleUpdate = (data: FormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} className="relative z-10">
      <div className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-5xl ">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 w-5xl">
              <div className="sm:flex sm:items-start">
                <TaskForm
                  data={taskToDelete}
                  onCancel={onCancel}
                  onSubmit={handleUpdate}
                  inCompleted={inCompleted}
                  title="Update task"
                  description="Update the task details"
                />
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
