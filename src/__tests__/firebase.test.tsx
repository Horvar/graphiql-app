// import your functions and mock Firebase
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from '../firebase/firebase';
import { FirebaseError } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  FirebaseError: jest.fn(),
  initializeApp: jest.fn().mockReturnValue({
    /* mock application object */
  }),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe('Firebase authentication tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles login error correctly', async () => {
    const error = new FirebaseError(
      'auth/invalid-email',
      'The email address is badly formatted.',
    );
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    const expectedErrorMessage = 'Something wrong with login!';
    await expect(
      logInWithEmailAndPassword('bademail', 'password'),
    ).resolves.toEqual(expectedErrorMessage);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      getAuth(),
      'bademail',
      'password',
    );
  });

  it('handles registration error correctly', async () => {
    const error = new FirebaseError(
      'auth/weak-password',
      'Password should be at least 6 characters',
    );
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    const expectedErrorMessage =
      'An error occurred during registration. Please try again.';
    await expect(
      registerWithEmailAndPassword('user@example.com', '123'),
    ).resolves.toEqual(expectedErrorMessage);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      getAuth(),
      'user@example.com',
      '123',
    );
  });

  it('logs in successfully', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: '123' },
    });

    await expect(
      logInWithEmailAndPassword('test@example.com', 'password'),
    ).resolves.not.toThrow();
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      getAuth(),
      'test@example.com',
      'password',
    );
  });

  it('handles login errors for invalid credentials', async () => {
    const error = new FirebaseError(
      'auth/invalid-credential',
      'Invalid credentials',
    );
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    const errorMessage = 'Something wrong with login!';
    await expect(
      logInWithEmailAndPassword('wrong@example.com', 'wrongpassword'),
    ).resolves.toEqual(errorMessage);
  });

  it('registers a new user successfully', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: '123' },
    });

    await expect(
      registerWithEmailAndPassword('newuser@example.com', 'newpassword'),
    ).resolves.not.toThrow();
  });

  it('handles registration errors for email already in use', async () => {
    const error = new FirebaseError(
      'auth/email-already-in-use',
      'This email is busy!',
    );
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    const errorMessage =
      'An error occurred during registration. Please try again.';
    await expect(
      registerWithEmailAndPassword('existing@example.com', 'password'),
    ).resolves.toEqual(errorMessage);
  });

  it('logs out successfully', () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);
    logout();
    expect(signOut).toHaveBeenCalledWith(getAuth());
  });
});
