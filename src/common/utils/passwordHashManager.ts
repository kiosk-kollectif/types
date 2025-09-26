import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string) => {
  //TODO: Implement password hashing
  return bcrypt.hashSync(password, 10);
};

export const verifyPasswword = (password: string, hash: string) => {
  //TODO: Implement password verification
  return bcrypt.compareSync(password, hash);
};
