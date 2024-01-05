import styles from './NotFoundPage.module.scss';

import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className={styles.notFound}>
      <div className={`${styles.notFoundContainer} container container--small`}>
        <h1 className={`${styles.notFoundTitle} title-1`}>Page Not Found</h1>
        <div className={styles.notFoundError}>404</div>
        <div className={`${styles.notFoundText} text-common`}>
          <p>
            Head back to the <Link to="/">Homepage</Link> or try searching for
            something else
          </p>
        </div>
        <Link className={styles.notFoundButton} to="/">
          Return
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
