import { passwordSchema } from '../schemas/yup/password-validation';

describe('password validation', () => {
  it('should require a password', async () => {
    await expect(passwordSchema.validate('')).rejects.toThrow(
      'Enter password!',
    );
  });

  it('should require a digit', async () => {
    await expect(passwordSchema.validate('Password')).rejects.toThrow(
      'Your password must contain at least one digit',
    );
  });

  it('should require an uppercase letter', async () => {
    await expect(passwordSchema.validate('password1')).rejects.toThrow(
      'Your password must contain at least one uppercase letter',
    );
  });

  it('should require a lowercase letter', async () => {
    await expect(passwordSchema.validate('PASSWORD1')).rejects.toThrow(
      'Your password must contain at least one lowercase letter',
    );
  });

  it('should require a special character', async () => {
    await expect(passwordSchema.validate('Password1')).rejects.toThrow(
      'Your password must contain at least one special character',
    );
  });

  it('should require at least 8 characters', async () => {
    await expect(passwordSchema.validate('Pass1!')).rejects.toThrow(
      'Your password must be at least 8 characters long',
    );
  });

  it('should accept a valid password', async () => {
    await expect(passwordSchema.validate('Password1!')).resolves.toBe(
      'Password1!',
    );
  });
});
