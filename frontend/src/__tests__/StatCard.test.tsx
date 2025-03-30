import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../components/Shared/StatCard';

describe('StatCard Component', () => {


  it('applies correct styling classes', () => {
    const mockIcon = <div data-testid="mock-icon">Icon</div>;
    
    render(
      <StatCard 
        title="Test Title" 
        value="42" 
        icon={mockIcon} 
        color="bg-red-100" 
      />
    );
    
    // Check card container styling
    const titleElement = screen.getByText('Test Title');
    const cardContainer = titleElement.closest('div')?.parentElement;
    expect(cardContainer).not.toBeNull();
    expect(cardContainer).toHaveClass('bg-white');
    expect(cardContainer).toHaveClass('rounded-lg');
    expect(cardContainer).toHaveClass('shadow-sm');
    expect(cardContainer).toHaveClass('border');
    
    // Check title styling
    expect(titleElement).toHaveClass('text-sm');
    expect(titleElement).toHaveClass('text-gray-500');
    
    // Check value styling
    const valueElement = screen.getByText('42');
    expect(valueElement).toHaveClass('text-2xl');
    expect(valueElement).toHaveClass('font-bold');
  });


});