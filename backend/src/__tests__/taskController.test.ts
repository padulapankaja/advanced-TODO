import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task, ITask } from '../models/taskModel';
import {
  createTask,
  getTask,
  searchTasks,
  updateTask,
  deleteTask,
  updateStatus,
} from '../controllers/taskController';
import { StatusCodes } from 'http-status-codes';
import { validationMessages } from '../constants/messages';
import { TaskPriority, TaskStatus } from '../constants/taskEnums';

// Mock the mongoose model
jest.mock('../models/taskModel');
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  Types: {
    ObjectId: {
      isValid: jest.fn(),
    },
  },
}));

describe('Task Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;
  let mockTaskData: Partial<ITask>;
  let mockTaskId: string;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    mockTaskId = '507f1f77bcf86cd799439011';
    mockTaskData = {
      _id: mockTaskId,
      title: 'Test Task',
      status: TaskStatus.NOT_DONE,
      priority: TaskPriority.MEDIUM,
      isRecurring: false,
      isDependency: false,
      dependencies: [],
    };

    // Setup req, res, next
    req = {
      body: { title: 'Test Task' },
      params: { id: mockTaskId },
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    // Mock mongoose ObjectId.isValid
    (mongoose.Types.ObjectId.isValid as jest.Mock) = jest.fn().mockImplementation((id) => {
      return id === mockTaskId;
    });
  });

  describe('createTask', () => {
    test('should create a task and return 201 status', async () => {
      // Mock implementation
      (Task.create as jest.Mock).mockResolvedValue(mockTaskData);

      // Call the function
      await createTask(req as Request, res as Response, next);

      // Assertions
      expect(Task.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockTaskData);
    });

    test('should call next with error when Task.create fails', async () => {
      // Mock implementation
      const error = new Error('Database error');
      (Task.create as jest.Mock).mockRejectedValue(error);

      // Call the function
      await createTask(req as Request, res as Response, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('getTask', () => {
    test('should return a task by id', async () => {
      // Mock implementation
      (Task.findById as jest.Mock).mockResolvedValue(mockTaskData);

      // Call the function
      await getTask(req as Request, res as Response, next);

      // Assertions
      expect(Task.findById).toHaveBeenCalledWith({ _id: mockTaskId });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockTaskData);
    });

    test('should return 404 when task is not found', async () => {
      // Mock implementation
      (Task.findById as jest.Mock).mockResolvedValue(null);

      // Call the function
      await getTask(req as Request, res as Response, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.NOT_FOUND,
        message: validationMessages.taskNotFound,
      });
    });

    test('should call next with error when Task.findById fails', async () => {
      // Mock implementation
      const error = new Error('Database error');
      (Task.findById as jest.Mock).mockRejectedValue(error);

      // Call the function
      await getTask(req as Request, res as Response, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('searchTasks', () => {
    test('should search tasks with filters', async () => {
      req.query = {
        title: 'Test',
        status: 'notDone',
        priority: 'high',
        isRecurring: 'false',
        isDependency: 'true',
      };

      // Mock tasks
      const mockTasks = [mockTaskData];
      const mockStats = [
        {
          _id: null,
          totalTasks: 10,
          completedTasks: 5,
          incompleteTasks: 5,
        },
      ];

      // Mock the find and sort methods
      const mockSortFunction = jest.fn().mockReturnThis();
      const mockPopulateFunction = jest.fn().mockResolvedValue(mockTasks);
      (Task.find as jest.Mock).mockReturnValue({
        sort: mockSortFunction,
        populate: mockPopulateFunction,
      });
      mockSortFunction.mockReturnValue({
        populate: mockPopulateFunction,
      });

      // Mock aggregation
      (Task.aggregate as jest.Mock).mockResolvedValue(mockStats);

      // Call the function
      await searchTasks(req as Request, res as Response, next);

      // Assertions
      expect(Task.find).toHaveBeenCalledWith({
        title: { $regex: /Test/i },
        status: { $in: ['notDone'] },
        priority: { $in: ['high'] },
        isRecurring: false,
        isDependency: true,
      });
      expect(mockSortFunction).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(mockPopulateFunction).toHaveBeenCalledWith('dependencies');
      expect(Task.aggregate).toHaveBeenCalled();

      // Check response
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        tasks: mockTasks,
        stat: {
          totalTasks: 10,
          completedTasks: 5,
          incompleteTasks: 5,
        },
      });
    });

    test('should call next with error when search fails', async () => {
      // Mock implementation
      const error = new Error('Database error');
      (Task.find as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Call the function
      await searchTasks(req as Request, res as Response, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTask', () => {
    test('should update a task and return the updated task', async () => {
      // Setup request body
      req.body = { todoData: { title: 'Updated Task' } };

      // Mock findByIdAndUpdate
      const updatedTask = { ...mockTaskData, title: 'Updated Task' };
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      // Call the function
      await updateTask(req as Request, res as Response, next);

      // Assertions
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockTaskId);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTaskId,
        { title: 'Updated Task' },
        { new: true, runValidators: true },
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    test('should return 404 when task is not found', async () => {
      // Mock implementation
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      // Call the function
      await updateTask(req as Request, res as Response, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.NOT_FOUND,
        message: validationMessages.taskNotFound,
      });
    });

    test('should call next with error when update fails', async () => {
      // Mock implementation
      const error = new Error('Database error');
      (Task.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

      // Call the function
      await updateTask(req as Request, res as Response, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteTask', () => {
    test('should delete a task and update dependencies', async () => {
      // Mock findByIdAndDelete
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTaskData);

      // Mock updateMany
      (Task.updateMany as jest.Mock).mockResolvedValue({ nModified: 2 });

      // Call the function
      await deleteTask(req as Request, res as Response, next);

      // Assertions
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockTaskId);
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(mockTaskId);
      expect(Task.updateMany).toHaveBeenCalledWith(
        { dependencies: mockTaskId },
        { $pull: { dependencies: mockTaskId } },
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.OK,
        message: validationMessages.taskDeleted,
      });
    });

    test('should return 404 when task is not found', async () => {
      // Mock implementation
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      // Call the function
      await deleteTask(req as Request, res as Response, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.NOT_FOUND,
        message: validationMessages.taskNotFound,
      });
      expect(Task.updateMany).not.toHaveBeenCalled();
    });

    test('should call next with error when delete fails', async () => {
      // Mock implementation
      const error = new Error('Database error');
      (Task.findByIdAndDelete as jest.Mock).mockRejectedValue(error);

      // Call the function
      await deleteTask(req as Request, res as Response, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateStatus', () => {
    test('should update task status when all dependencies are done', async () => {
      // Setup request
      req.body = { status: 'done' };

      // Mock task with dependencies
      const mockTaskWithDeps = {
        ...mockTaskData,
        dependencies: [
          { _id: 'dep1', status: 'done' },
          { _id: 'dep2', status: 'done' },
        ],
        updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
      };

      // Mock findById and populate
      const mockPopulateFunction = jest.fn().mockResolvedValue(mockTaskWithDeps);
      (Task.findById as jest.Mock).mockReturnValue({
        populate: mockPopulateFunction,
      });

      // Call the function
      await updateStatus(req as Request, res as Response, next);

      // Assertions
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockTaskId);
      expect(Task.findById).toHaveBeenCalledWith(mockTaskId);
      expect(mockPopulateFunction).toHaveBeenCalledWith('dependencies');
      expect(mockTaskWithDeps.updateOne).toHaveBeenCalledWith({ status: 'done' });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ nModified: 1 });
    });

    test('should return 400 when trying to mark as done with incomplete dependencies', async () => {
      // Setup request
      req.body = { status: 'done' };

      // Mock task with incomplete dependencies
      const mockTaskWithDeps = {
        ...mockTaskData,
        dependencies: [
          { _id: 'dep1', status: 'done' },
          { _id: 'dep2', status: 'notDone' }, // One dependency not done
        ],
        updateOne: jest.fn(),
      };

      // Mock findById and populate
      const mockPopulateFunction = jest.fn().mockResolvedValue(mockTaskWithDeps);
      (Task.findById as jest.Mock).mockReturnValue({
        populate: mockPopulateFunction,
      });

      // Call the function
      await updateStatus(req as Request, res as Response, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.BAD_REQUEST,
        message: validationMessages.taskDependentCom,
      });
      expect(mockTaskWithDeps.updateOne).not.toHaveBeenCalled();
    });

    test('should allow updating to a non-done status regardless of dependencies', async () => {
      // Setup request for non-done status
      req.body = { status: 'notDone' };

      // Mock task with incomplete dependencies
      const mockTaskWithDeps = {
        ...mockTaskData,
        dependencies: [
          { _id: 'dep1', status: 'done' },
          { _id: 'dep2', status: 'notDone' },
        ],
        updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
      };

      // Mock findById and populate
      const mockPopulateFunction = jest.fn().mockResolvedValue(mockTaskWithDeps);
      (Task.findById as jest.Mock).mockReturnValue({
        populate: mockPopulateFunction,
      });

      // Call the function
      await updateStatus(req as Request, res as Response, next);

      // Assertions
      expect(mockTaskWithDeps.updateOne).toHaveBeenCalledWith({ status: 'notDone' });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    test('should call next with error when status update fails', async () => {
      // Mock error differently
      const errorMsg = 'Database error';
      (Task.findById as jest.Mock).mockImplementation(() => {
        throw new Error(errorMsg);
      });

      // Call the function
      await updateStatus(req as Request, res as Response, next);

      // Assertions
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});
