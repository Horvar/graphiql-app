export interface User {
  email: string;
  password: string;
  ['confirm-password']?: string;
}
