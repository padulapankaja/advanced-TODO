import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmationModal from '../components/ConfirmationModel';

describe('ConfirmationModal Component', () => {
  // Basic rendering tests
  it('renders modal when open is true', () => {
    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    const { container } = render(
      <ConfirmationModal 
        open={false} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
      />
    );

    expect(container.firstChild).toBeNull();
  });

  // Button rendering tests
  it('renders both buttons when options are provided', () => {
    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('hides buttons when option text is empty', () => {
    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="" 
        option2="" 
      />
    );

    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  // Callback tests
  it('calls onConfirm when confirm button is clicked', () => {
    const mockOnConfirm = vi.fn();
    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
        onConfirm={mockOnConfirm} 
      />
    );

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockOnCancel = vi.fn();
    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
        onCancel={mockOnCancel} 
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledOnce();
  });

  // Dependent tasks tests
  it('renders dependent tasks when provided', () => {
    const dependentTasks = [
      { _id: '1', title: 'Task 1' },
      { _id: '2', title: 'Task 2' }
    ];

    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
        dependentTasks={dependentTasks} 
      />
    );

    expect(screen.getByText('!Dependent Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('does not render dependent tasks section when no tasks are provided', () => {
    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
      />
    );

    expect(screen.queryByText('!Dependent Tasks')).not.toBeInTheDocument();
  });

  // Accessibility and icon tests
  it('renders exclamation triangle icon', () => {
    render(
      <ConfirmationModal 
        open={true} 
        title="Test Title" 
        message="Test Message" 
        option1="Cancel" 
        option2="Confirm" 
      />
    );

    const icon = screen.getByTestId('exclamation-triangle-icon');
    expect(icon).toBeInTheDocument();
  });
});