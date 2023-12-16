import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

function HomePage() {
  return (
    <div>
      <h1 className={styles.titleTest}>Страница Приветствия</h1>
      <Link to={'/graphiql'} style={{ fontSize: '30px' }}>
        GraphiQL
      </Link>
    </div>
  );
}

export default HomePage;
