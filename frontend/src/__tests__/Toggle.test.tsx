import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleSwitch from '../components/Shared/ToggleSwitch';

describe('ToggleSwitch Component', () => {
  const mockRegister = vi.fn().mockReturnValue({});
  const mockOnChange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with label and unchecked state', () => {
    render(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={false}
        register={mockRegister}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('Test Toggle')).toBeInTheDocument();
    const inputElement = screen.getByRole('checkbox');
    expect(inputElement).not.toBeChecked();
  });

  it('renders with checked state', () => {
    render(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={true}
        register={mockRegister}
        onChange={mockOnChange}
      />
    );
    
    const inputElement = screen.getByRole('checkbox');
    expect(inputElement).toBeChecked();
  });

  it('calls onChange when clicked', () => {
    render(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={false}
        register={mockRegister}
        onChange={mockOnChange}
      />
    );
    
    const inputElement = screen.getByRole('checkbox');
    fireEvent.click(inputElement);
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('applies register function to input element', () => {
    render(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={false}
        register={mockRegister}
        onChange={mockOnChange}
      />
    );
    
    expect(mockRegister).toHaveBeenCalledWith('testToggle');
  });

  it('renders children when isChecked is true', () => {
    render(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={true}
        register={mockRegister}
        onChange={mockOnChange}
      >
        <div data-testid="child-content">Child Content</div>
      </ToggleSwitch>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('does not render children when isChecked is false', () => {
    render(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={false}
        register={mockRegister}
        onChange={mockOnChange}
      >
        <div data-testid="child-content">Child Content</div>
      </ToggleSwitch>
    );
    
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
  });

  it('applies correct styling based on isChecked state', () => {
    const { rerender } = render(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={false}
        register={mockRegister}
        onChange={mockOnChange}
      />
    );
    
    // When unchecked
    const toggleLabel = screen.getByText('Test Toggle');
    const parentElement = toggleLabel.parentElement;
    expect(parentElement).not.toBeNull();
    
    const sliderElement = parentElement?.querySelector('.slider');
    expect(sliderElement).not.toBeNull();
    expect(sliderElement).toHaveClass('bg-[#CCCCCE]');
    expect(sliderElement).not.toHaveClass('bg-[#4F39F6]');
    
    const dotElement = sliderElement?.querySelector('.dot');
    expect(dotElement).not.toBeNull();
    expect(dotElement).not.toHaveClass('translate-x-6');
    
    // Rerender with checked state
    rerender(
      <ToggleSwitch
        id="testToggle"
        label="Test Toggle"
        isChecked={true}
        register={mockRegister}
        onChange={mockOnChange}
      />
    );
    
    // When checked
    const updatedSliderElement = parentElement?.querySelector('.slider');
    expect(updatedSliderElement).not.toBeNull();
    expect(updatedSliderElement).toHaveClass('bg-[#4F39F6]');
    expect(updatedSliderElement).not.toHaveClass('bg-[#CCCCCE]');
    
    const updatedDotElement = updatedSliderElement?.querySelector('.dot');
    expect(updatedDotElement).not.toBeNull();
    expect(updatedDotElement).toHaveClass('translate-x-6');
  });
});