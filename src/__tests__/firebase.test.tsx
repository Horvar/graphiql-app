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
    /* здесь может быть мок объекта приложения */
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

  it('handles login errors', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new FirebaseError('auth/invalid-credential', 'Invalid credentials'),
    );

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

  it('handles registration errors', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new FirebaseError('auth/email-already-in-use', 'This email is busy!'),
    );

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
