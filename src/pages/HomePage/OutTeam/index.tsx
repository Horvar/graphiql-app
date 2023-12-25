import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { localizationType } from '../../../types/localization';
import translationsEn from '../../../localization/en.json';
import translationsRu from '../../../localization/ru.json';
import { useEffect } from 'react';
import styles from './OutTeam.module.scss';

import portrait1 from '../../../assets/images/developer-1.jpg';
import portrait2 from '../../../assets/images/developer-2.jpg';
import portrait3 from '../../../assets/images/developer-3.jpg';
import icons from '../../../assets/icons/sprite.svg';

export const OurTeam = () => {
  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const translations =
    language === 'en'
      ? (translationsEn as localizationType)
      : (translationsRu as localizationType);
  return (
    <div className={styles.homeWrapper}>
      <h2 className={`${styles.homeSubtitle} title-2`}>
        {translations.team.title}
      </h2>
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
                  {translations.team.members.semyon.name}
                </h3>
                <a
                  href="https://github.com/horvar"
                  target="_blank"
                  aria-label="Semyon's GitHub"
                  className={styles.teamItemLink}
                  rel="noreferrer"
                >
                  <svg className={styles.teamItemLinkIcon}>
                    <use href={`${icons}#github`}></use>
                  </svg>
                </a>
              </div>
              <div className={styles.teamItemRole}>
                {translations.team.members.semyon.position}
              </div>
              <div className={styles.teamItemText}>
                {translations.team.members.semyon.description}
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
                  {translations.team.members.dimash.name}
                </h3>
                <a
                  href="https://github.com/horvar"
                  target="_blank"
                  aria-label="Dimash's GitHub"
                  className={styles.teamItemLink}
                  rel="noreferrer"
                >
                  <svg className={styles.teamItemLinkIcon}>
                    <use href={`${icons}#github`}></use>
                  </svg>
                </a>
              </div>
              <div className={styles.teamItemRole}>
                {translations.team.members.dimash.position}
              </div>
              <div className={styles.teamItemText}>
                {translations.team.members.dimash.description}
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
                  {translations.team.members.almas.name}
                </h3>
                <a
                  href="https://github.com/horvar"
                  target="_blank"
                  aria-label="Almas's GitHub"
                  className={styles.teamItemLink}
                  rel="noreferrer"
                >
                  <svg className={styles.teamItemLinkIcon}>
                    <use href={`${icons}#github`}></use>
                  </svg>
                </a>
              </div>
              <div className={styles.teamItemRole}>
                {translations.team.members.almas.position}
              </div>
              <div className={styles.teamItemText}>
                {translations.team.members.almas.description}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
