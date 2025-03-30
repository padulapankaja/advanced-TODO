import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus, TaskPriority, RecurrencePattern } from '../constants/taskEnums';

// Base interface without Document extension
export interface ITaskBase {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dependencies?: mongoose.Types.ObjectId[];
  isRecurring: boolean;
  isDependency: boolean;
  recurrencePattern?: RecurrencePattern;
  cronCreated?: boolean;
}

// Document interface that extends Mongoose Document
export interface ITask extends Document, ITaskBase {}

// For when you need to represent a task that might not be saved yet
export type ITaskInput = Omit<ITaskBase, '_id'>;

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.NOT_DONE },
    priority: { type: String, enum: Object.values(TaskPriority), default: TaskPriority.LOW },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    isRecurring: { type: Boolean, default: false },
    isDependency: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: Object.values(RecurrencePattern) },
    cronCreated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
