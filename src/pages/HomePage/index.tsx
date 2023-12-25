import styles from './HomePage.module.scss';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';

import { AboutProject } from './AboutProject';
import { OurTeam } from './OutTeam';
import { Rss } from './Rss';

function HomePage() {
  const [loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className={styles.home}>
        <div className={`${styles.homeContainer} container container--small`}>
          <AboutProject />
          <OurTeam />
          <Rss />
        </div>
      </section>
    </>
  );
}

export default HomePage;
