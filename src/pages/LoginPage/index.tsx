import styles from './LoginPage.module.scss';

import icons from '../../assets/icons/sprite.svg';

import { yupResolver } from '@hookform/resolvers/yup';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { auth, logInWithEmailAndPassword } from '../../firebase/firebase';
import { User } from '../../entities/user.interface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link } from 'react-router-dom';
import { passwordSchema } from '../../schemas/yup';

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
        <h1 className={`${styles.accoutTitle} title-1`}>Account</h1>
        <form className={styles.accoutForm} onSubmit={handleSubmit(onLogin)}>
          <h2 className={`${styles.accoutFormTitle} title-2`}>Sign In</h2>

          <div className={styles.accoutFormWrapper}>
            <label className={styles.accoutFormLabel}>
              <span className={styles.accoutFormLegend}>Email:</span>
              <input
                type="email"
                {...register('email')}
                placeholder="Enter your Email"
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
              <span className={styles.accoutFormLegend}>Password:</span>
              <input
                type={passwordShown ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your Password"
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

            <input
              type="submit"
              value="Login"
              className={styles.accoutFormSubmit}
            />

            {errorLogin && (
              <div className={styles.accoutFormError}>{errorLogin}</div>
            )}

            <div className={`${styles.accoutFormText} text-common`}>
              <p>
                If you&apos;re new here and don&apos;t have an account yet,
                please <Link to="/register">click&nbsp;here</Link> to register
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
