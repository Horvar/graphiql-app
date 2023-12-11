// import styles from './RegisterPage.module.scss';
import { object, ref, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '../../entities/user.interface';

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
    .required("Enter password!"),
  ['confirm-password']: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required("Passwords must match"),
});

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function onRegister(data: User) {
    console.log(data);
  }

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
    </form>
  );
}

export default RegisterPage;
