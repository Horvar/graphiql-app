import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import * as reactFirebaseHooks from 'react-firebase-hooks/auth';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../store/languageSlice';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');

  return {
    ...originalModule,
    signInWithEmailAndPassword: jest.fn(),
  };
});

const renderWithLocalization = (initialLang = 'en') => {
  const store = configureStore({
    reducer: {
      language: (state = { language: initialLang }, action) =>
        languageReducer(state, action),
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </Provider>,
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    (reactFirebaseHooks.useAuthState as jest.Mock).mockReturnValue([
      { uid: 'test-user' },
      false,
    ]);
  });

  it('renders correctly in English', () => {
    const { getByText } = renderWithLocalization('en');
    expect(getByText('Sign in')).toBeInTheDocument();
  });

  it('renders correctly in Russian', () => {
    const { getByText } = renderWithLocalization('ru');
    expect(getByText('Войти')).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    const { getByText, getByTestId } = renderWithLocalization('en');

    fireEvent.change(getByTestId('email-input'), {
      target: { value: '' },
    });
    fireEvent.change(getByTestId('password-input'), {
      target: { value: '' },
    });
    fireEvent.click(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Enter valid email!')).toBeInTheDocument();
      expect(getByText('Enter password!')).toBeInTheDocument();
    });
  });

  it('redirects authenticated user to GraphiQLPage', async () => {
    renderWithLocalization();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/graphiql');
    });
  });

  it('toggles password visibility', async () => {
    const { getByTestId, getByLabelText } = renderWithLocalization();

    const passwordInput = getByTestId('password-input') as HTMLInputElement;
    const toggleButton = getByLabelText('Show Password');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
});
