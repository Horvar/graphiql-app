import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HomePage Component', () => {
  it('renders loading state initially', () => {
    (useAuthState as jest.Mock).mockReturnValue([true, false]);
    render(<HomePage />, { wrapper });

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders home page correctly when not loading', () => {
    (useAuthState as jest.Mock).mockReturnValue([false, false]);
    render(<HomePage />, { wrapper });

    expect(
      screen.getByText(/GraphiQL Explorer: Start Your Journey/i),
    ).toBeInTheDocument();
  });
});
