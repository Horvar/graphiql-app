import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import * as firebaseAuth from 'react-firebase-hooks/auth';

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
    render(<App />);
  });
});
