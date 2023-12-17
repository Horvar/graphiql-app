// import styles from './HomePage.module.scss'

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';

function HomePage() {
  const [loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>Страница приветствия</>;
}

export default HomePage;
