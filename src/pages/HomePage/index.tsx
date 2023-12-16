// import styles from './HomePage.module.scss'

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';

import Header from '../../components/Header';

function HomePage() {
  const [loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
    </>
  );
}

export default HomePage;
