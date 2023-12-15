import { string } from "yup";

export const passwordSchema = string()
  .required('Enter password!')
  .test('has-digit', 'Your password must contain at least one digit', (value) =>
    /\d/.test(value),
  )
  .test(
    'has-uppercase',
    'Your password must contain at least one uppercase letter',
    (value) => /[A-Z]/.test(value),
  )
  .test(
    'has-lowercase',
    'Your password must contain at least one lowercase letter',
    (value) => /[a-z]/.test(value),
  )
  .test(
    'has-special-char',
    'Your password must contain at least one special character',
    (value) => /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(value),
  )
  .min(8, 'Your password must be at least 8 characters long');
