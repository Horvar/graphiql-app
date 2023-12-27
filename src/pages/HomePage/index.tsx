import styles from './HomePage.module.scss';

import { AboutProject } from './AboutProject';
import { OurTeam } from './OutTeam';
import { Rss } from './Rss';

import portrait1 from '../../assets/images/developer-1.jpg';
import portrait2 from '../../assets/images/developer-2.jpg';
import portrait3 from '../../assets/images/developer-3.jpg';
import icons from '../../assets/icons/sprite.svg';

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
