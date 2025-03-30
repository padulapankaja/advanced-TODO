import cron from 'node-cron';
import { Task, ITaskBase } from '../models/taskModel';

const getCurrentTime = () => new Date().toLocaleTimeString();

// Run at midnight every day (0 0 * * *)
cron.schedule('*/5 * * * * *', async () => {
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
      const taskPattern = task.recurrencePattern?.toLowerCase();

      if (!taskPattern) {
        console.warn(`[${getCurrentTime()}] No recurrence pattern for task: ${task.title}`);
        continue;
      }

      // Check if we should create a new task instance today based on pattern
      const shouldCreateTask = shouldCreateTaskToday(now, taskPattern);

      if (!shouldCreateTask) {
        console.log(
          `[${getCurrentTime()}] Not time to create new task for: ${task.title} (${taskPattern})`,
        );
        continue;
      }

      // Check if a task with the same title already exists that was created by cron
      const existingTask = await Task.findOne({
        title: task.title,
        cronCreated: true,
        isRecurring: true,
        createdAt: {
          $gte: getPatternStartDate(now, taskPattern),
          $lt: getPatternEndDate(now, taskPattern),
        },
      });

      if (!existingTask) {
        // Create a new instance of the recurring task
        const newTask = new Task({
          title: task.title,
          status: 'notDone',
          priority: task.priority,
          dependencies: task.dependencies,
          isRecurring: true,
          isDependency: task.isDependency,
          cronCreated: true,
          recurrencePattern: task.recurrencePattern,
        });

        await newTask.save();
        console.log(`[${getCurrentTime()}] Created new task: ${task.title} (${taskPattern})`);
      } else {
        console.log(
          `[${getCurrentTime()}] Task "${task.title}" already exists for current ${taskPattern} period, skipping creation`,
        );
      }
    }
  } catch (error) {
    console.error(`[${getCurrentTime()}] Error in scheduler:`, error);
  }
});

// Determine if we should create a task today based on pattern
function shouldCreateTaskToday(currentDate: Date, pattern: string): boolean {
  switch (pattern) {
    case 'daily':
      return true;

    case 'weekly':
      // Create a new task only on Mondays (day 1)
      return currentDate.getDay() === 1;

    case 'monthly':
      // Create a new task only on the 1st day of the month
      return currentDate.getDate() === 1;

    default:
      console.warn(`[${getCurrentTime()}] Unknown pattern: ${pattern}, defaulting to daily`);
      return true;
  }
}

// Get start date of current pattern period for checking existing tasks
function getPatternStartDate(currentDate: Date, pattern: string): Date {
  const startDate = new Date(currentDate);
  startDate.setHours(0, 0, 0, 0);

  switch (pattern) {
    case 'daily':
      // Start of today
      return startDate;

    case 'weekly': {
      // Start of current week (Monday)
      const day = startDate.getDay();
      const diff = day === 0 ? 6 : day - 1;
      startDate.setDate(startDate.getDate() - diff);
      return startDate;
    }

    case 'monthly':
      // Start of current month
      startDate.setDate(1);
      return startDate;

    default:
      return startDate;
  }
}

// Get end date of current pattern period for checking existing tasks
function getPatternEndDate(currentDate: Date, pattern: string): Date {
  const endDate = getPatternStartDate(currentDate, pattern);

  switch (pattern) {
    case 'daily':
      endDate.setDate(endDate.getDate() + 1);
      return endDate;

    case 'weekly':
      endDate.setDate(endDate.getDate() + 7);
      return endDate;

    case 'monthly':
      endDate.setMonth(endDate.getMonth() + 1);
      return endDate;

    default:
      endDate.setDate(endDate.getDate() + 1);
      return endDate;
  }
}

export default cron;
