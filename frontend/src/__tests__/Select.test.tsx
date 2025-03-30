import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Select from '../components/Shared/Select';

// Mock the HeroIcon
vi.mock('@heroicons/react/16/solid', () => ({
  ChevronDownIcon: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
}));

describe('Select Component', () => {
  const mockRegister = vi.fn().mockReturnValue({});
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders select element with all options', () => {
    render(<Select id="testSelect" register={mockRegister} options={mockOptions} />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveAttribute('id', 'testSelect');
    expect(selectElement).toHaveAttribute('name', 'testSelect');
    
    // Check all options are rendered
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('option1');
    expect(options[0]).toHaveTextContent('Option 1');
    expect(options[1]).toHaveValue('option2');
    expect(options[1]).toHaveTextContent('Option 2');
    expect(options[2]).toHaveValue('option3');
    expect(options[2]).toHaveTextContent('Option 3');
  });

  it('renders chevron down icon', () => {
    render(<Select id="testSelect" register={mockRegister} options={mockOptions} />);
    
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
  });

  it('applies register function to select element', () => {
    render(<Select id="testSelect" register={mockRegister} options={mockOptions} />);
    
    expect(mockRegister).toHaveBeenCalledWith('testSelect');
  });

});