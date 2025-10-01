import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPasswword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
