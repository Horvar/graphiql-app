import styles from './HomePage.module.scss';

import { AboutProject } from './AboutProject';
import { OurTeam } from './OutTeam';
import { Rss } from './Rss';

function HomePage() {
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
