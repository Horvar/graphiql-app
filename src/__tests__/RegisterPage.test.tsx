import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import * as reactFirebaseHooks from 'react-firebase-hooks/auth';
import { registerWithEmailAndPassword } from '../firebase/firebase';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../store/languageSlice';

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

const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

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
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>,
    );

    // Допустим, у кнопки регистрации есть testid 'register-submit-button'
    const registerButton = getByTestId('register-submit-button');
    expect(registerButton).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>,
    );

    fireEvent.change(getByTestId('email-input'), {
      target: { value: '' },
    });
    fireEvent.change(getByTestId('password-input'), {
      target: { value: '' },
    });
    fireEvent.change(getByTestId('confirm-password-input'), {
      target: { value: '' },
    });

    fireEvent.click(getByTestId('register-submit-button'));

    await waitFor(() => {
      expect(getByTestId('error-email')).toBeInTheDocument();
      expect(getByTestId('error-password')).toBeInTheDocument();
      expect(getByTestId('error-confirm-password')).toBeInTheDocument();
    });
  });

  it('redirects authenticated user to GraphiQLPage', async () => {
    (reactFirebaseHooks.useAuthState as jest.Mock).mockReturnValue([
      { uid: 'test-user' },
      false,
    ]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/graphiql');
    });
  });

  it('toggles password visibility', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>,
    );

    const passwordInput = getByTestId('password-input') as HTMLInputElement;
    const toggleButton = getByTestId('toggle-password-visibility');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('toggles confirm password visibility', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>,
    );

    const confirmPasswordInput = getByTestId(
      'confirm-password-input',
    ) as HTMLInputElement; // Приведение типа
    const toggleVisibilityButton = getByTestId(
      'toggle-confirm-password-visibility',
    );

    // Проверяем, что тип поля ввода — password
    expect(confirmPasswordInput.type).toBe('password');

    // Кликаем на кнопку, чтобы показать пароль
    fireEvent.click(toggleVisibilityButton);

    // Проверяем, что тип поля ввода изменился на text
    expect(confirmPasswordInput.type).toBe('text');

    // Снова кликаем на кнопку, чтобы скрыть пароль
    fireEvent.click(toggleVisibilityButton);

    // Проверяем, что тип поля ввода снова стал password
    expect(confirmPasswordInput.type).toBe('password');
  });
});
