import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import languageReducer from '../store/languageSlice';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

interface TestState {
  language: {
    language: string;
  };
}

const createTestStore = (initialState: TestState) => {
  const rootReducer = combineReducers({
    language: languageReducer,
  });

  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
};

const wrapper = (store: ReturnType<typeof createTestStore>) => {
  const WrapperComponent = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  WrapperComponent.displayName = 'WrapperComponent';
  return WrapperComponent;
};

describe('HomePage Component', () => {
  it('renders home page in English', () => {
    const store = createTestStore({ language: { language: 'en' } });
    (useAuthState as jest.Mock).mockReturnValue([false, false]);
    render(<HomePage />, { wrapper: wrapper(store) });

    expect(
      screen.getByText(/GraphiQL Explorer: Start Your Journey/i),
    ).toBeInTheDocument();
  });

  it('renders home page in Russian', () => {
    const store = createTestStore({ language: { language: 'ru' } });
    (useAuthState as jest.Mock).mockReturnValue([false, false]);
    render(<HomePage />, { wrapper: wrapper(store) });

    expect(
      screen.getByText(/Graphql Explorer: Начните свое путешествие/i),
    ).toBeInTheDocument();
  });
});
