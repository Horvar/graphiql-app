import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, logout } from '../../firebase/firebase';

import { useDispatch } from 'react-redux';
import { setLanguage } from '../../store/languageSlice';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { localizationType } from '../../types/localization';
import translationsEn from '../../localization/en.json';
import translationsRu from '../../localization/ru.json';

import styles from './Header.module.scss';
import icons from '../../assets/icons/sprite.svg';

function Header() {
  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const translations =
    language === 'en'
      ? (translationsEn as localizationType)
      : (translationsRu as localizationType);

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);

  const toggleLanguageDropdown = () => setShowLanguageDropdown((prev) => !prev);
  const toggleAuthDropdown = () => setShowAuthDropdown((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dispatch = useDispatch();

  const changeLanguage = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof Element) {
        const isLanguageDropdownClick = target.closest(
          `.${styles.headerDropdown}`,
        );
        const isAuthDropdownClick = target.closest(`.${styles.headerDropdown}`);

        if (!isLanguageDropdownClick) {
          setShowLanguageDropdown(false);
        }
        if (!isAuthDropdownClick) {
          setShowAuthDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = () => {
    const offset = window.scrollY;
    setIsScrolled(offset > 10);
    setIsMobile(window.innerWidth <= 540);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <header
      className={`${styles.header} ${
        isScrolled || isMobile ? styles.headerFixed : ''
      }`}
    >
      <div className={`${styles.headerContainer} container`}>
        <div className={styles.headerColLeft}>
          <button
            type="button"
            className={styles.headerButton}
            aria-label="Home Page"
            onClick={() => navigate('/')}
          >
            <svg className={styles.headerButtonIcon}>
              <use href={`${icons}#home`}></use>
            </svg>
          </button>

          {user && (
            <button
              type="button"
              className={styles.headerButtonLink}
              onClick={() => navigate('/graphiql')}
            >
              <svg className={styles.headerButtonIcon}>
                <use href={`${icons}#graphiql`}></use>
              </svg>
              <span>{translations.header.graphQL}</span>
            </button>
          )}
        </div>

        <div className={styles.headerColRight}>
          <div className={styles.headerDropdownWrapper}>
            <button
              type="button"
              className={`${styles.headerButton} ${
                showLanguageDropdown ? styles.active : ''
              }`}
              aria-label="Select Language"
              onClick={toggleLanguageDropdown}
            >
              <svg className={styles.headerButtonIcon}>
                <use href={`${icons}#language`}></use>
              </svg>
            </button>
            {showLanguageDropdown && (
              <div className={styles.headerDropdown}>
                <ul className={styles.headerDropdownList}>
                  <li className={styles.headerDropdownItem}>
                    <button
                      type="button"
                      className={styles.headerButtonText}
                      onClick={() => changeLanguage('ru')}
                    >
                      {translations.header.language.russian}
                    </button>
                  </li>
                  <li className={styles.headerDropdownItem}>
                    <button
                      type="button"
                      className={styles.headerButtonText}
                      onClick={() => changeLanguage('en')}
                    >
                      {translations.header.language.english}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {!user && (
            <div className={styles.headerDropdownWrapper}>
              <button
                type="button"
                className={`${styles.headerButton} ${
                  showAuthDropdown ? styles.active : ''
                }`}
                aria-label="Login/Register"
                onClick={toggleAuthDropdown}
              >
                <svg className={styles.headerButtonIcon}>
                  <use href={`${icons}#account`}></use>
                </svg>
              </button>

              {showAuthDropdown && (
                <div className={styles.headerDropdown}>
                  <ul className={styles.headerDropdownList}>
                    <li className={styles.headerDropdownItem}>
                      <button
                        type="button"
                        className={styles.headerButtonText}
                        onClick={() => navigate('/login')}
                      >
                        {translations.header.sign.in}
                      </button>
                    </li>
                    <li className={styles.headerDropdownItem}>
                      <button
                        type="button"
                        className={styles.headerButtonText}
                        onClick={() => navigate('/register')}
                      >
                        {translations.header.sign.up}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {user && (
            <button
              type="button"
              className={styles.headerButton}
              aria-label="Exit Account"
              onClick={handleLogout}
            >
              <svg className={styles.headerButtonIcon}>
                <use href={`${icons}#exit`}></use>
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
