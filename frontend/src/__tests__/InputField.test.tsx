import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import InputField from '../components/Shared/InputField';

// Mock the register function from react-hook-form
const mockRegister = vi.fn().mockReturnValue({
  name: 'test-field',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
});

describe('InputField Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock the Date to ensure consistent tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-03-29'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with label and input field', () => {
    render(
      <InputField 
        id="test-field" 
        label="Test Field" 
        register={mockRegister} 
      />
    );
    
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows asterisk for required fields', () => {
    render(
      <InputField 
        id="test-field" 
        label="Test Field" 
        register={mockRegister} 
        required={true} 
      />
    );
    
    const labelElement = screen.getByText('Test Field');
    expect(labelElement.parentElement).toContainHTML('<span class="text-red-600">*</span>');
  });

  it('displays error message when provided', () => {
    const errorMessage = 'This field has an error';
    render(
      <InputField 
        id="test-field" 
        label="Test Field" 
        register={mockRegister} 
        errorMessage={errorMessage} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('applies min date attribute for date inputs when minDate is true', () => {
    render(
      <InputField 
        id="test-date" 
        label="Test Date" 
        type="date" 
        register={mockRegister} 
        minDate={true} 
      />
    );
    
    const dateInput = screen.getByLabelText('Test Date');
    expect(dateInput).toHaveAttribute('min', '2025-03-29');
  });

  it('does not apply min date attribute when minDate is false', () => {
    render(
      <InputField 
        id="test-date" 
        label="Test Date" 
        type="date" 
        register={mockRegister} 
        minDate={false} 
      />
    );
    
    const dateInput = screen.getByLabelText('Test Date');
    expect(dateInput).not.toHaveAttribute('min');
  });

  it('passes placeholder to input when provided', () => {
    const placeholder = 'Enter a value';
    render(
      <InputField 
        id="test-field" 
        label="Test Field" 
        register={mockRegister} 
        placeholder={placeholder} 
      />
    );
    
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  it('calls register with the correct parameters', () => {
    render(
      <InputField 
        id="test-field" 
        label="Test Field" 
        register={mockRegister} 
        required={true}
        errorMessage="Custom error message"
      />
    );
    
    expect(mockRegister).toHaveBeenCalledWith('test-field', {
      required: 'Custom error message'
    });
  });

  it('uses default error message when required but no custom message', () => {
    render(
      <InputField 
        id="test-field" 
        label="Test Field" 
        register={mockRegister} 
        required={true}
      />
    );
    
    expect(mockRegister).toHaveBeenCalledWith('test-field', {
      required: 'Test Field is required'
    });
  });

  it('applies autoComplete attribute when provided', () => {
    render(
      <InputField 
        id="email" 
        label="Email" 
        register={mockRegister} 
        autoComplete="email"
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('applies type attribute correctly', () => {
    render(
      <InputField 
        id="password" 
        label="Password" 
        type="password"
        register={mockRegister}
      />
    );
    
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });
});