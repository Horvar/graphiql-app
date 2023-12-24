/** @jsxImportSource react */
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import NotFoundPage from '../pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders correctly', () => {
    render(
      <Router>
        <NotFoundPage />
      </Router>,
    );

    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /Homepage/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');
  });
});
