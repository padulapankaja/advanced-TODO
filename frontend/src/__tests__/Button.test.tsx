import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Shared/Button';

describe('Button Component', () => {
  // Test that the component renders correctly with default props
  it('renders with default props', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // primary variant by default
    expect(button).toHaveClass('px-4 py-2'); // medium size by default
    expect(button).not.toHaveClass('opacity-50');
    expect(button).not.toHaveAttribute('disabled');
  });

  // Test all variants
  it('applies the correct classes for primary variant', () => {
    render(<Button onClick={() => {}} variant="primary">Primary</Button>);
    
    const button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  it('applies the correct classes for secondary variant', () => {
    render(<Button onClick={() => {}} variant="secondary">Secondary</Button>);
    
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-gray-300');
    expect(button).toHaveClass('text-gray-700');
    expect(button).toHaveClass('hover:bg-gray-400');
  });

  it('applies the correct classes for danger variant', () => {
    render(<Button onClick={() => {}} variant="danger">Danger</Button>);
    
    const button = screen.getByRole('button', { name: /danger/i });
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-red-700');
  });

  // Test all sizes
  it('applies the correct classes for small size', () => {
    render(<Button onClick={() => {}} size="small">Small</Button>);
    
    const button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('px-3 py-1');
    expect(button).toHaveClass('text-sm');
  });

  it('applies the correct classes for medium size', () => {
    render(<Button onClick={() => {}} size="medium">Medium</Button>);
    
    const button = screen.getByRole('button', { name: /medium/i });
    expect(button).toHaveClass('px-4 py-2');
  });

  it('applies the correct classes for large size', () => {
    render(<Button onClick={() => {}} size="large">Large</Button>);
    
    const button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('px-5 py-3');
    expect(button).toHaveClass('text-lg');
  });

  // Test disabled state
  it('applies disabled styles when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled={true}>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toHaveAttribute('disabled');
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  // Test click handler
  it('calls the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test that disabled button doesn't call onClick
  it('does not call onClick when disabled button is clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled={true}>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test with complex children
  it('renders with complex children', () => {
    render(
      <Button onClick={() => {}}>
        <span>Complex</span>
        <span>Children</span>
      </Button>
    );
    
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  // Test combining different props
  it('combines variant and size props correctly', () => {
    render(
      <Button onClick={() => {}} variant="danger" size="large">
        Large Danger
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /large danger/i });
    expect(button).toHaveClass('bg-red-600'); // danger variant
    expect(button).toHaveClass('px-5 py-3'); // large size
  });
});