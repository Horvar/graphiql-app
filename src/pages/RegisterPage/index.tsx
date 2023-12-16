// import styles from './RegisterPage.module.scss';
import { object, ref, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '../../entities/user.interface';
import { auth, registerWithEmailAndPassword } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { MouseEvent, useEffect, useState } from 'react';
import { passwordSchema } from '../../schemas/yup';

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
    <form onSubmit={handleSubmit(onRegister)}>
      <label htmlFor="email">Email:</label>
      <input type="email" {...register('email')} id="email" />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">Password:</label>
      <input
        type={passwordShown ? 'text' : 'password'}
        {...register('password')}
        id="password"
      />
      <button onClick={togglePasswordVisibility}>
        {passwordShown ? 'Hide' : 'Show'} the password
      </button>
      {errors.password && <p>{errors.password.message}</p>}
      <label htmlFor="confirm-password">Confirm Password:</label>
      <input
        type={confirmPasswordShown ? 'text' : 'password'}
        {...register('confirm-password')}
        id="confirm-password"
      />
      <button onClick={toggleConfirmPasswordVisibility}>
        {confirmPasswordShown ? 'Hide' : 'Show'} the password
      </button>
      {errors['confirm-password'] && (
        <p>{errors['confirm-password'].message}</p>
      )}
      <input type="submit" value="Register" />
      {registerError && <p>{registerError}</p>}
    </form>
  );
}

export default RegisterPage;
