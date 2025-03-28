import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../components/Card";
import { FormData, TaskStatus } from "../types/todoTypes";

// Sample task data for testing
const mockTask: FormData = {
  _id: "1",
  title: "Test Task",
  priority: "medium",
  status: "notDone",
  isRecurring: false,
  isDependency: false,
  recurrencePattern: "",
  dependencies: [],
  isDependent: false,
  isRecurrent: false,
};

describe("TaskCard Component", () => {
  // Test rendering basic task information
  it("renders task title", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  // Test priority display
  it("displays priority with correct color", () => {
    render(<TaskCard task={mockTask} />);
    const priorityElement = screen.getByText("medium");
    expect(priorityElement).toHaveClass("bg-yellow-100 text-yellow-800");
  });

  // Test action buttons visibility
  it("shows delete, update, and complete buttons for non-completed task", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  // Test completed task state
  it("shows reopen button for completed task", () => {
    const completedTask = { ...mockTask, status: "done" as TaskStatus };
    render(<TaskCard task={completedTask} />);
    expect(screen.getByText("Reopen")).toBeInTheDocument();
  });

  // Test callback functions
  it("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = vi.fn();
    render(<TaskCard task={mockTask} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
  });

  it("calls onComplete when done button is clicked", () => {
    const mockOnComplete = vi.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    const doneButton = screen.getByText("Done");
    fireEvent.click(doneButton);

    expect(mockOnComplete).toHaveBeenCalledWith(mockTask);
  });

  it("calls onUpdate when update button is clicked", () => {
    const mockOnUpdate = vi.fn();
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} />);

    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask);
  });

  // Test recurring task display
  it("shows recurring task information", () => {
    const recurringTask = {
      ...mockTask,
      isRecurring: true,
      recurrencePattern: "Daily",
    };
    render(<TaskCard task={recurringTask} />);

    expect(screen.getByText("Recurrent: Daily")).toBeInTheDocument();
  });

  // Test title truncation
  it("truncates long titles", () => {
    const longTitleTask = {
      ...mockTask,
      title:
        "This is a very long task title that should be truncated after 40 characters",
    };
    render(<TaskCard task={longTitleTask} />);

    const titleElement = screen.getByText(/This is a very long task title.../);
    expect(titleElement).toBeInTheDocument();
  });
});
