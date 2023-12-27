import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { localizationType } from '../../../types/localization';
import translationsEn from '../../../localization/en.json';
import translationsRu from '../../../localization/ru.json';
import { useEffect } from 'react';
import styles from './About.module.scss';

export const AboutProject = () => {
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
      <h1 className={`${styles.homeTitle} title-1`}>{translations.title}</h1>
      <h2 className={`${styles.homeSubtitle} title-2`}>
        {translations.about.title}
      </h2>
      <div className={`${styles.homeText} text-common`}>
        {translations.about.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};
