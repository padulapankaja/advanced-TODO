import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ITask, Task } from '../models/taskModel';
import { StatusCodes } from 'http-status-codes';
import { validationMessages } from '../constants/messages';
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.create(req.body);
    res.status(StatusCodes.CREATED).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find().populate('dependencies');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById({
      _id: req.params.id,
    });
    if (!task) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: validationMessages.taskNotFound,
      });
      return;
    }
    res.status(StatusCodes.OK).json(task);
  } catch (error) {
    next(error);
  }
};

export const searchTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, status, priority, isRecurring, isDependency } = req.query;

    const filter: any = {};

    // add conditions that
    if (title) filter.title = { $regex: new RegExp(String(title), 'i') };
    if (status) filter.status = { $in: String(status).split(',') };
    if (priority) filter.priority = { $in: String(priority).split(',') };
    if (isRecurring !== undefined) filter.isRecurring = isRecurring === 'true';
    if (isDependency !== undefined) filter.isDependency = isDependency === 'true';

    const [tasks, stats] = await Promise.all([
      Object.keys(req.query).length > 0
        ? Task.find(filter).sort({ updatedAt: -1 }).populate('dependencies')
        : Task.find().sort({ updatedAt: -1 }).populate('dependencies'),

      // Use MongoDB aggregation for statistics
      Task.aggregate([
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] },
            },
            incompleteTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'notDone'] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    // Extract statistics from aggregation result (or provide defaults)
    const taskStats = stats[0] || { totalTasks: 0, completedTasks: 0, incompleteTasks: 0 };

    delete taskStats._id;

    res.status(StatusCodes.OK).json({
      tasks,
      stat: taskStats,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: validationMessages.invalidTaskId,
      });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body.todoData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: validationMessages.taskNotFound,
      });
      return;
    }

    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: validationMessages.invalidTaskId,
      });
      return;
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: validationMessages.taskNotFound,
      });
      return;
    }

    // check dependent tasks
    await Task.updateMany(
      { dependencies: req.params.id },
      { $pull: { dependencies: req.params.id } },
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: validationMessages.taskDeleted,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: validationMessages.invalidTaskId,
      });
      return;
    }

    const checkTask = await Task.findById(req.params.id).populate<{ dependencies: ITask[] }>(
      'dependencies',
    );
    if (checkTask) {
      if (req.body.status === 'done') {
        const com = checkTask.dependencies?.every((dep) => dep.status === 'done');
        if (!com) {
          res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: validationMessages.taskDependentCom,
          });
          return;
        }
      }
    }
    const update = await checkTask?.updateOne({ status: req.body.status });
    if (!update) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: validationMessages.taskNotFound,
      });
      return;
    }

    res.status(StatusCodes.OK).json(update);
  } catch (error) {
    next(error);
  }
};
