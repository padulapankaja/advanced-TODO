import { Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
type dependentTask = {
  _id: string;
  title: string;
};
interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  option1: string;
  option2: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dependentTasks?: dependentTask[];
}

export default function ConfirmationModal({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  option1,
  option2,
  dependentTasks,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onClose={onCancel ?? (() => {})}  className="relative z-10">
      <div className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                    {dependentTasks && dependentTasks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900">
                          !Dependent Tasks
                        </h4>
                        <ul className="mt-2 text-sm text-gray-500">
                          {dependentTasks.map((task: dependentTask) => (
                            <li key={task._id} className="mt-1">
                              {task.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                hidden={option2.length === 0}
                onClick={onConfirm}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                {option2}
              </button>
              <button
                hidden={option1.length === 0}
                type="button"
                onClick={onCancel}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                {option1}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
