import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { localizationType } from '../../../types/localization';
import translationsEn from '../../../localization/en.json';
import translationsRu from '../../../localization/ru.json';
import { useEffect } from 'react';
import styles from './Rss.module.scss';

export const Rss = () => {
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
        {translations.rss.title}
      </h2>
      <div className={`${styles.homeText} text-common`}>
        {translations.rss.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <a href="https://rs.school/react/" target="_blank" rel="noreferrer">
          RSSchool
        </a>
      </div>
    </div>
  );
};
