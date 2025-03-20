import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus, TaskPriority, RecurrencePattern } from '../constants/taskEnums';

export interface ITask extends Document {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  dependencies?: mongoose.Types.ObjectId[];
  isRecurring: boolean;
  isDependency: boolean;
  recurrencePattern?: RecurrencePattern;
  cronCreated?: boolean;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.NOT_DONE },
    priority: { type: String, enum: Object.values(TaskPriority), default: TaskPriority.LOW },
    dueDate: { type: Date },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    isRecurring: { type: Boolean, default: false },
    isDependency: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: Object.values(RecurrencePattern) },
    cronCreated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
