// import styles from './LoginPage.module.scss'

import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { auth, logInWithEmailAndPassword } from '../../firebase/firebase';
import { User } from '../../entities/user.interface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

const schema = object().shape({
  email: string()
    .email()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter valid email!',
    )
    .required('Enter email!'),
  password: string()
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/,
      'Your password are weak!',
    )
    .required('Enter password!'),
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

  async function onLogin(data: User) {
    setLoginError(
      (await logInWithEmailAndPassword(data.email, data.password)) ?? '',
    );
  }

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/');
  }, [user, loading]);

  return (
    <form onSubmit={handleSubmit(onLogin)}>
      <label htmlFor="email">Email:</label>
      <input type="email" {...register('email')} id="email" />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">Password:</label>
      <input type="password" {...register('password')} id="password" />
      {errors.password && <p>{errors.password.message}</p>}
      <input type="submit" value="Login" />
      {errorLogin && <p>{errorLogin}</p>}
    </form>
  );
}

export default LoginPage;
