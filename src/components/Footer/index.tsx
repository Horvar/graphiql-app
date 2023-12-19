import styles from './Footer.module.scss';

import icons from '../../assets/icons/sprite.svg';
import logo from '../../assets/images/logo-rs.svg';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContainer} container`}>
        <div className={styles.footerColLeft}>
          <a
            href="https://rs.school/react/"
            target="_blank"
            className={styles.footerLogo}
            rel="noreferrer"
          >
            <img
              src={logo}
              alt="RSShool React Course"
              className={styles.footerLogoImg}
            />
          </a>
          <div className={styles.footerTextMobile}>2023 — 2024</div>
        </div>
        <div className={styles.footerColCenter}>
          <div className={styles.footerText}>2023 — 2024</div>
        </div>
        <div className={styles.footerColRight}>
          <ul className={styles.footerLinkList}>
            <li className={styles.footerLinkItem}>
              <a
                href="https://github.com/horvar"
                target="_blank"
                className={styles.footerLink}
                rel="noreferrer"
                aria-label="Semyon's GitHub"
              >
                <svg className={styles.footerLinkIcon}>
                  <use href={`${icons}#github`}></use>
                </svg>
                <div className={styles.footerLinkText}>Semyon</div>
              </a>
            </li>
            <li className={styles.footerLinkItem}>
              <a
                href="https://github.com/dimash95"
                target="_blank"
                className={styles.footerLink}
                rel="noreferrer"
                aria-label="Dimash's GitHub"
              >
                <svg className={styles.footerLinkIcon}>
                  <use href={`${icons}#github`}></use>
                </svg>
                <div className={styles.footerLinkText}>Dimash</div>
              </a>
            </li>
            <li className={styles.footerLinkItem}>
              <a
                href="https://github.com/almasklchv"
                target="_blank"
                className={styles.footerLink}
                rel="noreferrer"
                aria-label="Almas's GitHub"
              >
                <svg className={styles.footerLinkIcon}>
                  <use href={`${icons}#github`}></use>
                </svg>
                <div className={styles.footerLinkText}>Almas</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
