import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../components/Shared/Pagination";

// Mock the Lucide icons
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <div data-testid="chevron-left">Left</div>,
  ChevronRight: () => <div data-testid="chevron-right">Right</div>,
}));

describe("Pagination Component", () => {
  it("renders page information correctly", () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} />
    );

    expect(screen.getByTestId("page-text")).toHaveTextContent("Page");
    expect(screen.getByTestId("current-page")).toHaveTextContent("3");
    expect(screen.getByTestId("of-text")).toHaveTextContent("of");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("10");
  });

  it("renders previous and next buttons", () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} />
    );

    expect(screen.getByTestId("chevron-left")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-right")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    );

    const prevButton = screen.getByTestId("chevron-left").closest("button");
    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveClass("bg-gray-200");
    expect(prevButton).toHaveClass("text-gray-400");
    expect(prevButton).toHaveClass("cursor-not-allowed");
  });

  it("disables next button on last page", () => {
    render(
      <Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />
    );

    const nextButton = screen.getByTestId("chevron-right").closest("button");
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveClass("bg-gray-200");
    expect(nextButton).toHaveClass("text-gray-400");
    expect(nextButton).toHaveClass("cursor-not-allowed");
  });

  it("enables both buttons when on a middle page", () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />
    );

    const prevButton = screen.getByTestId("chevron-left").closest("button");
    const nextButton = screen.getByTestId("chevron-right").closest("button");

    expect(prevButton).not.toBeDisabled();
    expect(prevButton).toHaveClass("bg-blue-500");
    expect(prevButton).toHaveClass("hover:bg-blue-600");

    expect(nextButton).not.toBeDisabled();
    expect(nextButton).toHaveClass("bg-blue-500");
    expect(nextButton).toHaveClass("hover:bg-blue-600");
  });

  it("calls onPageChange with currentPage - 1 when previous button is clicked", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />
    );

    const prevButton: HTMLButtonElement = screen
      .getByTestId("chevron-left")
      .closest("button") as HTMLButtonElement;
    fireEvent.click(prevButton);

    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with currentPage + 1 when next button is clicked", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />
    );

    const nextButton: HTMLButtonElement = screen
      .getByTestId("chevron-right")
      .closest("button") as HTMLButtonElement;
    fireEvent.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(6);
  });

  it("does not call onPageChange when disabled previous button is clicked", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={handlePageChange}
      />
    );

    const prevButton: HTMLButtonElement = screen
      .getByTestId("chevron-left")
      .closest("button") as HTMLButtonElement;
    fireEvent.click(prevButton);

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("does not call onPageChange when disabled next button is clicked", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={handlePageChange}
      />
    );

    const nextButton: HTMLButtonElement = screen
      .getByTestId("chevron-right")
      .closest("button") as HTMLButtonElement;
    fireEvent.click(nextButton);

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("handles single-page scenario properly", () => {
    render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );

    const prevButton = screen.getByTestId("chevron-left").closest("button");
    const nextButton = screen.getByTestId("chevron-right").closest("button");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(screen.getByTestId("page-text")).toHaveTextContent("Page");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("of-text")).toHaveTextContent("of");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("1");
  });
});
