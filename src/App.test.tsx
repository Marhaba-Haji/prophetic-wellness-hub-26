import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check that at least one element with the expected text exists
    expect(screen.getAllByText(/prophetic|revivo|heal|wellness|hub/i).length).toBeGreaterThan(0);
  });
}); 