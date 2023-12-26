import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import * as reactFirebaseHooks from 'react-firebase-hooks/auth';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    (reactFirebaseHooks.useAuthState as jest.Mock).mockReturnValue([
      { uid: 'test-user' },
      false,
    ]);
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );
    expect(getByText('Sign In')).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.change(getByPlaceholderText('Enter your Email'), {
      target: { value: '' },
    });
    fireEvent.change(getByPlaceholderText('Enter your Password'), {
      target: { value: '' },
    });
    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Enter valid email!')).toBeInTheDocument();
      expect(getByText('Enter password!')).toBeInTheDocument();
    });
  });

  it('redirects authenticated user to GraphiQLPage', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/graphiql');
    });
  });
});
