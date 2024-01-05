import { FirebaseError, initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAuQOEXoNcKvIdgEmavBvjkg10aYRU_35U',
  authDomain: 'graphiql-app-5c89d.firebaseapp.com',
  projectId: 'graphiql-app-5c89d',
  storageBucket: 'graphiql-app-5c89d.appspot.com',
  messagingSenderId: '704984743581',
  appId: '1:704984743581:web:b19007c81a3ae864841e74',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function logInWithEmailAndPassword(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/invalid-credential') {
        return 'You have entered an incorrect email address or password!';
      }
    }

    return 'Something wrong with login!';
  }
}

async function registerWithEmailAndPassword(email: string, password: string) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/email-already-in-use') {
        return 'This email is busy!';
      }
    }

    return 'An error occurred during registration. Please try again.';
  }
}

function logout() {
  signOut(auth);
}

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};
