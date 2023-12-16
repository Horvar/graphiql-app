// import styles from './HomePage.module.scss'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';

import Header from '../../components/Header';

function HomePage() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div>
        {!user && (
          <>
            <button onClick={() => navigate('/login')}>Sign In</button>
            <button onClick={() => navigate('/register')}>Sign Up</button>
          </>
        )}
        {user && (
          <button onClick={() => navigate('/graphiql')}>Go to Main Page</button>
        )}
      </div>
    </>
  );
}

export default HomePage;
