import * as yup from 'yup';

describe('Password Schema Validation', () => {
  it('should pass with a valid password', async () => {
    const validPassword = 'Password123!';

    const isValid = await yup
      .string()
      .required()
      .test(
        'has-digit',
        'Your password must contain at least one digit',
        (value) => /\d/.test(value),
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
      .min(8, 'Your password must be at least 8 characters long')
      .isValid(validPassword);

    expect(isValid).toBe(true);
  });

  it('should fail if password is empty', async () => {
    const emptyPassword = '';

    const isValid = await yup
      .string()
      .required()
      .test(
        'has-digit',
        'Your password must contain at least one digit',
        (value) => /\d/.test(value),
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
      .min(8, 'Your password must be at least 8 characters long')
      .isValid(emptyPassword);

    expect(isValid).toBe(false);
  });

  it('should fail if password has no digits', async () => {
    const noDigitPassword = 'PasswordNoDigit';

    const isValid = await yup
      .string()
      .required()
      .test(
        'has-digit',
        'Your password must contain at least one digit',
        (value) => /\d/.test(value),
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
      .min(8, 'Your password must be at least 8 characters long')
      .isValid(noDigitPassword);

    expect(isValid).toBe(false);
  });

  it('should fail if password has no uppercase letters', async () => {
    const noUppercasePassword = 'password123!';

    const isValid = await yup
      .string()
      .required()
      .test(
        'has-digit',
        'Your password must contain at least one digit',
        (value) => /\d/.test(value),
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
      .min(8, 'Your password must be at least 8 characters long')
      .isValid(noUppercasePassword);

    expect(isValid).toBe(false);
  });

  it('should fail if password has no lowercase letters', async () => {
    const noLowercasePassword = 'PASSWORD123!';

    const isValid = await yup
      .string()
      .required()
      .test(
        'has-digit',
        'Your password must contain at least one digit',
        (value) => /\d/.test(value),
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
      .min(8, 'Your password must be at least 8 characters long')
      .isValid(noLowercasePassword);

    expect(isValid).toBe(false);
  });

  it('should fail if password has no special characters', async () => {
    const noSpecialCharPassword = 'Password123';

    const isValid = await yup
      .string()
      .required()
      .test(
        'has-digit',
        'Your password must contain at least one digit',
        (value) => /\d/.test(value),
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
      .min(8, 'Your password must be at least 8 characters long')
      .isValid(noSpecialCharPassword);

    expect(isValid).toBe(false);
  });

  it('should fail if password is less than 8 characters long', async () => {
    const shortPassword = 'Pass1!';

    const isValid = await yup
      .string()
      .required()
      .test(
        'has-digit',
        'Your password must contain at least one digit',
        (value) => /\d/.test(value),
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
      .min(8, 'Your password must be at least 8 characters long')
      .isValid(shortPassword);

    expect(isValid).toBe(false);
  });
});
