import styles from './Header.module.scss';

import icons from '../../assets/icons/sprite.svg';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, logout } from '../../firebase/firebase';

function Header() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const [isScrolled, setIsScrolled] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);

  const toggleLanguageDropdown = () => setShowLanguageDropdown((prev) => !prev);
  const toggleAuthDropdown = () => setShowAuthDropdown((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
  
      if (target instanceof Element) {
        const isLanguageDropdownClick = target.closest(`.${styles.headerDropdown}`);
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
    if (offset > 300) {
      setIsScrolled(true);
      setAnimate(false);
    } else if (isScrolled && !animate) {
      setAnimate(true);
      setTimeout(() => {
        setIsScrolled(false);
        setAnimate(false);
      }, 100);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled, animate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.headerFixed : ''} ${
          animate ? styles.headerHiding : ''
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
          </div>

          <div className={styles.headerColCenter}>
            {user && (
              <button
                type="button"
                className={styles.headerButtonLink}
                onClick={() => navigate('/graphiql')}
              >
                Go to GraphiQL!
              </button>
            )}
          </div>

          <div className={styles.headerColRight}>
            <button
              type="button"
              className={styles.headerButton}
              aria-label="Select Language"
              onClick={toggleLanguageDropdown}
            >
              <svg className={styles.headerButtonIcon}>
                <use href={`${icons}#language`}></use>
              </svg>
            </button>

            {showLanguageDropdown && (
              <div className={styles.headerDropdown}>язык</div>
            )}

            <div>
              {!user && (
                <>
                  <button
                    type="button"
                    className={styles.headerButton}
                    aria-label="Login/Register"
                    onClick={toggleAuthDropdown}
                  >
                    <svg className={styles.headerButtonIcon}>
                      <use href={`${icons}#account`}></use>
                    </svg>
                  </button>

                  {showAuthDropdown && (
                    <div className={styles.headerDropdown}>
                      <button type="button" onClick={() => navigate('/login')}>
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/register')}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </>
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
        </div>
      </header>
    </>
  );
}

export default Header;
