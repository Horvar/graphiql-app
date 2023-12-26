import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import * as reactFirebaseHooks from 'react-firebase-hooks/auth';
import { registerWithEmailAndPassword } from '../firebase/firebase';

jest.mock('../firebase/firebase', () => ({
  auth: {},
  registerWithEmailAndPassword: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    (reactFirebaseHooks.useAuthState as jest.Mock).mockReturnValue([
      null,
      false,
    ]);
    (registerWithEmailAndPassword as jest.Mock).mockReset();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>,
    );
    expect(getByText('Sign Up')).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>,
    );

    fireEvent.change(getByPlaceholderText('Enter your Email'), {
      target: { value: '' },
    });
    fireEvent.change(getByPlaceholderText('Enter your Password'), {
      target: { value: '' },
    });
    fireEvent.change(getByPlaceholderText('Confirm your Password'), {
      target: { value: '' },
    });
    fireEvent.click(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Enter valid email!')).toBeInTheDocument();
      expect(getByText('Enter password!')).toBeInTheDocument();
      expect(getByText('Passwords must match')).toBeInTheDocument();
    });
  });

  it('redirects authenticated user to GraphiQLPage', async () => {
    (reactFirebaseHooks.useAuthState as jest.Mock).mockReturnValue([
      { uid: 'test-user' },
      false,
    ]);

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/graphiql');
    });
  });

  it('toggles password visibility', async () => {
    const { getByPlaceholderText, getByLabelText } = render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>,
    );

    const passwordInput = getByPlaceholderText(
      'Enter your Password',
    ) as HTMLInputElement;
    const toggleButton = getByLabelText('Show Password');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
});
