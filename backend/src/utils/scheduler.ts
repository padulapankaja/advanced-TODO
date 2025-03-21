import cron from 'node-cron';
import { Task } from '../models/taskModel';

const getCurrentTime = () => new Date().toLocaleTimeString();

// For testing, you can run more frequently: '* * * * *' (every minute)
cron.schedule('* * * * *', async () => {
  console.log(`[${getCurrentTime()}] Running daily recurring task check...`);
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all recurring tasks not due today or in the past
    const recurringTasks: any = await Task.find({
      isRecurring: true,
      dueDate: { $gte: tomorrow },
    });

    console.log(`[${getCurrentTime()}] Found ${recurringTasks.length} recurring tasks to process.`);

    for (const task of recurringTasks) {
      const taskDueDate = new Date(task.dueDate);
      const taskDueDateStart = new Date(taskDueDate);
      taskDueDateStart.setHours(0, 0, 0, 0); // Reset to start of the day for date comparison

      // Skip tasks that are due in the future
      if (taskDueDateStart > today) {
        console.log(
          `[${getCurrentTime()}] Skipping future task: ${task.title}, Due: ${taskDueDate}`,
        );
        continue;
      }

      console.log(`[${getCurrentTime()}] Processing task: ${task.title}, Due: ${taskDueDate}`);

      // For tasks due today or in the past, check if next instance already exists
      const taskPattern = task.recurrencePattern.toLowerCase();

      // Calculate the next due date based on the recurrence pattern
      const nextDueDate = calculateNextDueDate(taskDueDate, taskPattern);
      const nextDueDateStart = new Date(nextDueDate);
      nextDueDateStart.setHours(0, 0, 0, 0); // Reset to start of the day for date comparison

      // First check if there's already any task with the same title due on the next date
      // This is a more thorough check that will find any tasks with the same title due on that day
      const existingTasksForNextDay = await Task.find({
        title: task.title,
        dueDate: {
          $gte: nextDueDateStart,
          $lt: new Date(nextDueDateStart.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      if (existingTasksForNextDay.length > 0) {
        console.log(
          `[${getCurrentTime()}] Found ${existingTasksForNextDay.length} existing tasks for "${task.title}" on ${nextDueDateStart.toDateString()}, skipping creation`,
        );
        continue;
      }

      // Now check for exact match with time as a secondary check
      const exactMatchTask = await Task.findOne({
        title: task.title,
        dueDate: nextDueDate,
      });

      if (exactMatchTask) {
        console.log(
          `[${getCurrentTime()}] Skipped duplicate task (exact match): ${task.title} for ${nextDueDate}`,
        );
      } else {
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
      }
    }
  } catch (error) {
    console.error(`[${getCurrentTime()}] Error in scheduler:`, error);
  }
});

//Calculate the next due date based on the recurrence pattern
function calculateNextDueDate(currentDueDate: Date, recurrencePattern: string) {
  const nextDueDate = new Date(currentDueDate);

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

  return nextDueDate;
}

export default cron;
