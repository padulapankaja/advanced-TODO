import { z } from 'zod';
import { TaskStatus, TaskPriority, RecurrencePattern } from '../constants/taskEnums';
import { validationMessages } from '../constants/messages';

// Task Schema
export const createTaskSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    status: z.nativeEnum(TaskStatus),
    priority: z.nativeEnum(TaskPriority),
    dependencies: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, validationMessages.invalidObjectId))
      .optional(),
    isRecurring: z.boolean(),
    isDependency: z.boolean(),
    recurrencePattern: z.nativeEnum(RecurrencePattern).optional(),
  })
  .strict();

export const updateTaskSchema = z.object({
  title: z.string().min(1, validationMessages.titleRequired).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  isRecurring: z.boolean().optional(),
  isDependency: z.boolean().optional(),
  recurrencePattern: z.nativeEnum(RecurrencePattern).optional(),
});

export const statusUpdate = z
  .object({
    status: z.nativeEnum(TaskStatus),
  })
  .strict();
