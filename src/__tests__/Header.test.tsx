import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Provider } from 'react-redux';
import { store } from '../store/store';

import * as firebaseModule from '../firebase/firebase';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('../firebase/firebase', () => ({
  ...jest.requireActual('../firebase/firebase'),
  logout: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Header Component', () => {
  const mockAuthState = useAuthState as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Header component', () => {
    mockAuthState.mockReturnValue([null, false]);
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );
    expect(screen.getByLabelText(/Home Page/i)).toBeInTheDocument();
  });

  test('renders login and register buttons when not authenticated', () => {
    mockAuthState.mockReturnValue([null, false]);
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText(/Login\/Register/i));

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('renders logout button when authenticated', () => {
    mockAuthState.mockReturnValue([{ uid: '123' }, false]);
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );
    expect(screen.getByLabelText(/Exit Account/i)).toBeInTheDocument();
  });

  test('navigates to home on home button click', () => {
    mockAuthState.mockReturnValue([null, false]);
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );
    fireEvent.click(screen.getByLabelText(/Home Page/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('updates isScrolled on window scroll', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass('headerFixed');
  });

  test('updates isMobile on window resize', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    fireEvent.resize(window);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass('headerFixed');
  });

  test('toggles language and auth dropdowns correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );
    fireEvent.click(screen.getByLabelText(/Select Language/i));
    expect(screen.getByText(/Russian/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Login\/Register/i));
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('navigates correctly based on auth state', () => {
    mockAuthState.mockReturnValue([null, false]);
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );
    fireEvent.click(screen.getByLabelText(/Login\/Register/i));
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  test('logs out and navigates to home on logout', () => {
    mockAuthState.mockReturnValue([{ uid: '123' }, false]);

    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    const logoutButton = screen.getByLabelText(/Exit Account/i);
    fireEvent.click(logoutButton);

    expect(firebaseModule.logout).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('closes language and auth dropdowns when clicking outside', () => {
    mockAuthState.mockReturnValue([null, false]);

    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText(/Select Language/i));
    expect(screen.getByText(/Russian/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Login\/Register/i));
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText(/Russian/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
  });

  test('toggles language dropdown', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText(/Select Language/i));
    expect(screen.getByText(/Russian/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Select Language/i));
    expect(screen.queryByText(/Russian/i)).not.toBeInTheDocument();
  });

  test('toggles auth dropdown', () => {
    mockAuthState.mockReturnValue([null, false]);

    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText(/Login\/Register/i));
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Login\/Register/i));
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
  });

  test('handles logout', async () => {
    mockAuthState.mockReturnValue([{ uid: '123' }, false]);

    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText(/Exit Account/i));
    expect(firebaseModule.logout).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('changes language', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText(/Select Language/i));
    fireEvent.click(screen.getByText(/Russian/i));
    expect(store.getState().language.language).toBe('ru');
    expect(localStorage.getItem('lang')).toBe('ru');
  });
});
