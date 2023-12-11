// import styles from './RegisterPage.module.scss';
import { object, ref, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '../../entities/user.interface';
import { auth, registerWithEmailAndPassword } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const schema = object().shape({
  email: string()
    .email('Enter valid email!')
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
  ['confirm-password']: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Passwords must match'),
});

function RegisterPage() {
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

  async function onRegister(data: User) {
    setErrorRegister(
      (await registerWithEmailAndPassword(data.email, data.password)) ?? '',
    );
  }

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/');
  }, [user, loading]);

  return (
    <form onSubmit={handleSubmit(onRegister)}>
      <label htmlFor="email">Email:</label>
      <input type="email" {...register('email')} id="email" />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">Password:</label>
      <input type="password" {...register('password')} id="password" />
      {errors.password && <p>{errors.password.message}</p>}
      <label htmlFor="confirm-password">Confirm Password:</label>
      <input
        type="password"
        {...register('confirm-password')}
        id="confirm-password"
      />
      {errors['confirm-password'] && (
        <p>{errors['confirm-password'].message}</p>
      )}
      <input type="submit" value="Register" />
      {registerError && <p>{registerError}</p>}
    </form>
  );
}

export default RegisterPage;
