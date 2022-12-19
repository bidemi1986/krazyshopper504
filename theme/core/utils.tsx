export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';
  if (password.length < 6) return 'Password cannot be less than 6 characters.';
  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};
export const firstNameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'First name cannot be empty.';

  return '';
};
export const lastNameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Last name cannot be empty.';

  return '';
};