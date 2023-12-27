import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import * as firebaseAuth from 'react-firebase-hooks/auth';
import { Provider } from 'react-redux';
import { store } from '../store/store';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('../firebase/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (firebaseAuth.useAuthState as jest.Mock).mockReturnValue([null, false]);
  });

  it('renders without errors', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
  });
});
