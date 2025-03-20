import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/taskModel';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
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
    const { title, status, priority, isRecurring, dueDate, isDependency } = req.query;

    const filter: any = {
      ...(title && { title: { $regex: new RegExp(title as string, 'i') } }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(isRecurring !== undefined && { isRecurring: isRecurring === 'true' }),
      ...(isDependency !== undefined && { isDependency: isDependency === 'true' }),
      ...(dueDate && { dueDate: { $gte: new Date(dueDate as string) } }),
    };

    // Fetch tasks based on the filters
    const tasks = await Task.find(filter);
    res.status(StatusCodes.OK).json(tasks);
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

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Apply schema validation
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

    const checkTask = await Task.findById(req.params.id).populate('dependencies');
    if (checkTask) {
      if (req.body.status === 'done') {
        const com = checkTask.dependencies?.every((dep: any) => dep.status === 'done');
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
