import { yupResolver } from '@hookform/resolvers/yup';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { auth, logInWithEmailAndPassword } from '../../firebase/firebase';
import { User } from '../../entities/user.interface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { passwordSchema } from '../../schemas/yup';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { localizationType } from '../../types/localization';
import translationsEn from '../../localization/en.json';
import translationsRu from '../../localization/ru.json';

import icons from '../../assets/icons/sprite.svg';
import styles from './LoginPage.module.scss';
import { Link } from 'react-router-dom';

const schema = object().shape({
  email: string()
    .email()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter valid email!',
    )
    .required('Enter email!'),
  password: passwordSchema,
});

function LoginPage() {
  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const translations =
    language === 'en'
      ? (translationsEn as localizationType)
      : (translationsRu as localizationType);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [user, loading] = useAuthState(auth);
  const [errorLogin, setLoginError] = useState('');

  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const togglePasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setPasswordShown(!passwordShown);
  };

  async function onLogin(data: User) {
    setLoginError(
      (await logInWithEmailAndPassword(data.email, data.password)) ?? '',
    );
  }

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/graphiql');
  }, [user, loading]);

  return (
    <section className={styles.accout}>
      <div className={`${styles.accoutContainer} container container--small`}>
        <form className={styles.accoutForm} onSubmit={handleSubmit(onLogin)}>
          <h2 className={`${styles.accoutFormTitle} title-2`}>
            {' '}
            {translations.signIn.title}
          </h2>

          <div className={styles.accoutFormWrapper}>
            <label className={styles.accoutFormLabel}>
              <input
                type="email"
                {...register('email')}
                placeholder={translations.signIn.email}
                className={`${styles.accoutFormInput} ${
                  errors.email ? styles.accoutFormInputError : ''
                }`}
              />
              {errors.email && (
                <span className={styles.accoutFormError}>
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className={styles.accoutFormLabel}>
              <input
                type={passwordShown ? 'text' : 'password'}
                {...register('password')}
                placeholder={translations.signIn.password}
                className={`${styles.accoutFormInput} ${
                  errors.password ? styles.accoutFormInputError : ''
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={passwordShown ? 'Hide Password' : 'Show Password'}
                className={styles.accoutFormReveal}
              >
                <svg className={styles.accoutFormRevealIcon}>
                  <use
                    href={`${icons}#${
                      passwordShown ? 'eyeClosed' : 'eyeOpened'
                    }`}
                  ></use>
                </svg>
              </button>
              {errors.password && (
                <span className={styles.accoutFormError}>
                  {errors.password.message}
                </span>
              )}
            </label>

            <input
              type="submit"
              value={translations.signIn.submit}
              className={styles.accoutFormSubmit}
            />

            {errorLogin && (
              <div className={styles.accoutFormError}>{errorLogin}</div>
            )}

            <div className={`${styles.accoutFormText} text-common`}>
              <p>{translations.signIn.hint}</p>
              <Link to="/register">{translations.signIn.link}</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
