import { useEffect } from 'react';
import styles from './GraphiQLPage.module.scss'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function GraphiQLPage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/login')
  })

  return <h1 className={styles.titleTest}>Страница GraphiQL</h1>;
}

export default GraphiQLPage;
