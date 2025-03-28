import cron from 'node-cron';
import { Task, ITaskBase } from '../models/taskModel';

const getCurrentTime = () => new Date().toLocaleTimeString();

cron.schedule('0 0 * * *', async () => {
  console.log(`[${getCurrentTime()}] Running daily recurring task check...`);
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Find all recurring tasks
    const recurringTasks: ITaskBase[] = await Task.find({
      isRecurring: true,
    });

    console.log(`[${getCurrentTime()}] Found ${recurringTasks.length} recurring tasks to process.`);

    for (const task of recurringTasks) {
      // Calculate the next due date based on the recurrence pattern
      const taskPattern = task.recurrencePattern?.toLowerCase();
      const nextDueDate = calculateNextDueDate(now, taskPattern);

      if (!nextDueDate) {
        console.warn(`[${getCurrentTime()}] No next due date calculated for task: ${task.title}`);
        continue;
      }

      const nextDueDateStart = new Date(nextDueDate);
      nextDueDateStart.setHours(0, 0, 0, 0); // Reset to start of the day for date comparison

      // Check if a task with the same title already exists for the next due date
      const existingTasksForNextDay = await Task.find({
        title: task.title,
        dueDate: {
          $gte: nextDueDateStart,
          $lt: new Date(nextDueDateStart.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      if (existingTasksForNextDay.length === 0) {
        // Create a new instance of the recurring task
        const newTask = new Task({
          title: task.title,
          status: 'notDone',
          priority: task.priority,
          dueDate: nextDueDate,
          isRecurring: true,
          recurrencePattern: task.recurrencePattern,
          dependencies: task.dependencies,
          cronCreated: true,
        });

        await newTask.save();
        console.log(`[${getCurrentTime()}] Created new task: ${task.title} for ${nextDueDate}`);
      } else {
        console.log(
          `[${getCurrentTime()}] Found ${existingTasksForNextDay.length} existing tasks for "${task.title}" on ${nextDueDateStart.toDateString()}, skipping creation`,
        );
      }
    }
  } catch (error) {
    console.error(`[${getCurrentTime()}] Error in scheduler:`, error);
  }
});

// Calculate the next due date based on the recurrence pattern
function calculateNextDueDate(currentDate: Date, recurrencePattern?: string) {
  const nextDueDate = new Date(currentDate);

  if (recurrencePattern === undefined) {
    return;
  } else {
    switch (recurrencePattern.toLowerCase()) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      default:
        // Default to daily if pattern not recognized
        nextDueDate.setDate(nextDueDate.getDate() + 1);
    }
  }

  return nextDueDate;
}

export default cron;
