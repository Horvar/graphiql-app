import styles from './HomePage.module.scss';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';

import portrait1 from '../../assets/images/developer-1.jpg';
import portrait2 from '../../assets/images/developer-2.jpg';
import portrait3 from '../../assets/images/developer-3.jpg';
import icons from '../../assets/icons/sprite.svg';

function HomePage() {
  const [loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className={styles.home}>
        <div className={`${styles.homeContainer} container container--small`}>
          <div className={styles.homeWrapper}>
            <h1 className={`${styles.homeTitle} title-1`}>
              GraphiQL&nbsp;Explorer: Start&nbsp;Your&nbsp;Journey
            </h1>
            <h2 className={`${styles.homeSubtitle} title-2`}>About Project</h2>
            <div className={`${styles.homeText} text-common`}>
              <p>
                This project is an integral part of the RSSchool curriculum and
                involves the creation of a comprehensive GraphiQL application.
                The application boasts a welcoming page that greets users,
                coupled with a robust user authentication system to ensure
                secure access.
              </p>
              <p>
                The main GraphQL page is the heart of the application, featuring
                an extensive range of functionalities. Users can benefit from
                query and variable editors, a header editor, and an on-demand
                documentation explorer. Additionally, there is a dedicated
                response section and the capability to switch between different
                API endpoints with ease.
              </p>
              <p>
                The technical foundation of the application is built upon React
                18+ and TypeScript. It adheres to strict coding standards that
                include semantic HTML, client-side validation, and a minimum
                test coverage of 80%. These measures guarantee a high-quality
                codebase and a reliable application.
              </p>
              <p>
                The design of the application prioritizes interactivity,
                offering a responsive layout that ensures consistency across
                various devices and platforms. The final product delivers a
                user-friendly GraphiQL interface that supports multiple
                languages, significantly enhancing the user experience for those
                interacting with GraphQL APIs.
              </p>
            </div>
          </div>

          <div className={styles.homeWrapper}>
            <h2 className={`${styles.homeSubtitle} title-2`}>Our Team</h2>
            <div className={styles.team}>
              <ul className={styles.teamList}>
                <li className={styles.teamItem}>
                  <img
                    src={portrait1}
                    alt="Semyon Kalashnikov"
                    className={styles.teamItemImg}
                  />
                  <div className={styles.teamItemDescription}>
                    <div className={styles.teamItemHeading}>
                      <h3 className={`${styles.teamItemName} title-3`}>
                        Semyon Kalashnikov
                      </h3>
                      <a
                        href="https://github.com/horvar"
                        target="_blank"
                        aria-label="Semyon's GitHub"
                        className={styles.teamItemLink} rel="noreferrer"
                      >
                        <svg className={styles.teamItemLinkIcon}>
                          <use href={`${icons}#github`}></use>
                        </svg>
                      </a>
                    </div>
                    <div className={styles.teamItemRole}>Team Leader</div>
                    <div className={styles.teamItemText}>
                      As the team leader, this member was pivotal in fostering
                      team collaboration and setting up the project repository.
                      They were responsible for the visual aspect of the
                      interface and wrote tests for various components, ensuring
                      both aesthetic appeal and functional reliability of the
                      project.
                    </div>
                  </div>
                </li>
                <li className={styles.teamItem}>
                  <img
                    src={portrait2}
                    alt="Dinmukhamed Amirov"
                    aria-label="Dimash's GitHub"
                    className={styles.teamItemImg}
                  />
                  <div className={styles.teamItemDescription}>
                    <div className={styles.teamItemHeading}>
                      <h3 className={`${styles.teamItemName} title-3`}>
                        Dinmukhamed Amirov
                      </h3>
                      <a
                        href="https://github.com/horvar"
                        target="_blank"
                        aria-label="Dimash's GitHub"
                        className={styles.teamItemLink} rel="noreferrer"
                      >
                        <svg className={styles.teamItemLinkIcon}>
                          <use href={`${icons}#github`}></use>
                        </svg>
                      </a>
                    </div>
                    <div className={styles.teamItemRole}>
                      Frontend Developer
                    </div>
                    <div className={styles.teamItemText}>
                      This individual was instrumental in setting up the core
                      aspects of the GraphiQL playground and translating the
                      application. Their efforts ensured a more intuitive and
                      accessible interface, catering to a wider audience and
                      improving user interaction.
                    </div>
                  </div>
                </li>
                <li className={styles.teamItem}>
                  <img
                    src={portrait3}
                    alt="Almas Kilichov"
                    className={styles.teamItemImg}
                  />
                  <div className={styles.teamItemDescription}>
                    <div className={styles.teamItemHeading}>
                      <h3 className={`${styles.teamItemName} title-3`}>
                        Almas Kilichov
                      </h3>
                      <a
                        href="https://github.com/horvar"
                        target="_blank"
                        aria-label="Almas's GitHub"
                        className={styles.teamItemLink} rel="noreferrer"
                      >
                        <svg className={styles.teamItemLinkIcon}>
                          <use href={`${icons}#github`}></use>
                        </svg>
                      </a>
                    </div>
                    <div className={styles.teamItemRole}>
                      Frontend Developer
                    </div>
                    <div className={styles.teamItemText}>
                      Specialized in Firebase, this member played a crucial role
                      in developing the registration process and redirects. They
                      also contributed significantly to displaying documentation
                      in GraphiQL, enhancing the overall functionality and user
                      experience of the project.
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.homeWrapper}>
            <h2 className={`${styles.homeSubtitle} title-2`}>
              RSSchool Course
            </h2>
            <div className={`${styles.homeText} text-common`}>
              <p>
                The React Course offered by The Rolling Scopes School (RSSchool)
                is a free, online program. It is specifically designed for
                students who have successfully completed RS School Stage #2 or
                those with practical experience in JavaScript, TypeScript, Git,
                GitHub, NPM, Webpack, CSS3/HTML5, and a solid understanding of
                REST.
              </p>
              <p>
                The course is inclusive, providing an opportunity for
                individuals from any professional background or location to
                learn and enhance their skills. It serves as a platform for
                personal and professional growth in the field of web
                development.
              </p>
              <p>
                Upon completion, students are awarded an electronic certificate,
                acknowledging their dedication and the skills they have
                acquired. The course is set to commence on October 23, 2023. It
                embodies the school&apos;s ethos of Pay it forward, which
                encourages participants to contribute to the community by
                sharing their knowledge and becoming mentors to the next
                generation of students. For additional details or to enroll,
                interested parties are invited to visit the{' '}
                <a href="https://rs.school/react/" target="_blank" rel="noreferrer">
                  RSSchool website
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
