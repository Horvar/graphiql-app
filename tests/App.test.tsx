/** @jsxImportSource react */
import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

function renderWithRouter(ui: ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(ui);
}

describe('App Router', () => {
  test('renders the home page', () => {
    renderWithRouter(<App />, { route: '/' });
    expect(
      screen.getByText(/GraphiQL Explorer: Start Your Journey/i),
    ).toBeInTheDocument();
  });

  test('renders the login page', () => {
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('renders the registration page', () => {
    renderWithRouter(<App />, { route: '/register' });
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('renders the GraphiQL page', () => {
    renderWithRouter(<App />, { route: '/graphiql' });
    expect(screen.getByText(/GraphiQL Playground/i)).toBeInTheDocument();
  });

  test('renders the 404 page on incorrect route', () => {
    renderWithRouter(<App />, { route: '/some/random/route' });
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
  });
});
