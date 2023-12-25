import { object, ref, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '../../entities/user.interface';
import { auth, registerWithEmailAndPassword } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link } from 'react-router-dom';
import { MouseEvent, useEffect, useState } from 'react';
import { passwordSchema } from '../../schemas/yup';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { localizationType } from '../../types/localization';
import translationsEn from '../../localization/en.json';
import translationsRu from '../../localization/ru.json';

import icons from '../../assets/icons/sprite.svg';
import styles from './RegisterPage.module.scss';

const schema = object().shape({
  email: string()
    .email('Enter valid email!')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter valid email!',
    )
    .required('Enter email!'),
  password: passwordSchema,
  ['confirm-password']: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Passwords must match'),
});

function RegisterPage() {
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
  const [registerError, setErrorRegister] = useState('');
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [confirmPasswordShown, setConfirmPasswordShown] =
    useState<boolean>(false);

  const togglePasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = (
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    setConfirmPasswordShown(!confirmPasswordShown);
  };

  async function onRegister(data: User) {
    setErrorRegister(
      (await registerWithEmailAndPassword(data.email, data.password)) ?? '',
    );
  }

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/graphiql');
  }, [user, loading]);

  return (
    <section className={styles.accout}>
      <div className={`${styles.accoutContainer} container container--small`}>
        <form className={styles.accoutForm} onSubmit={handleSubmit(onRegister)}>
          <h2 className={`${styles.accoutFormTitle} title-2`}>
            {translations.signUp.title}
          </h2>

          <div className={styles.accoutFormWrapper}>
            <label className={styles.accoutFormLabel}>
              <input
                type="email"
                {...register('email')}
                placeholder={translations.signUp.email}
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
                placeholder={translations.signUp.password}
                className={`${styles.accoutFormInput} ${
                  errors.password ? styles.accoutFormInputError : ''
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
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

            <label className={styles.accoutFormLabel}>
              <input
                type={confirmPasswordShown ? 'text' : 'password'}
                {...register('confirm-password')}
                placeholder={translations.signUp.confirm}
                className={`${styles.accoutFormInput} ${
                  errors.password ? styles.accoutFormInputError : ''
                }`}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={styles.accoutFormReveal}
              >
                <svg className={styles.accoutFormRevealIcon}>
                  <use
                    href={`${icons}#${
                      confirmPasswordShown ? 'eyeClosed' : 'eyeOpened'
                    }`}
                  ></use>
                </svg>
              </button>
              {errors['confirm-password'] && (
                <span className={styles.accoutFormError}>
                  {errors['confirm-password'].message}
                </span>
              )}
            </label>

            <input
              type="submit"
              value={translations.signUp.submit}
              className={styles.accoutFormSubmit}
            />

            {registerError && <p>{registerError}</p>}

            <div className={`${styles.accoutFormText} text-common`}>
              <p>{translations.signUp.hint}</p>
              <Link to="/login">{translations.signUp.link}</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
