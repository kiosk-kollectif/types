/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as nodemailer from 'nodemailer';

export const sendAccountConfirmationMail = async (
  email: string,
  code: number,
): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'faouzanekouko@gmail.com',
      pass: 'dmry jkhb nnwr ormj',
    },
  });

  const mailerOptions = {
    from: 'testmailforprojectKioskKollectif@gmail.com',
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is ${code}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailerOptions, (error) => {
      if (error) {
        reject(new Error(String(error)));
      }

      return resolve(true);
    });
  });
};

export const sendPasswordResetMail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'faouzanekouko@gmail.com',
      pass: 'dmry jkhb nnwr ormj',
    },
  });

  const mailerOptions = {
    from: 'testmailforprojectKioskKollectif@gmail.com',
    to: email,
    subject: 'Reset your password',
    text: `click on this links to reset your Password : https://exemple.com/reset-password?code=${code}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailerOptions, (error) => {
      if (error) {
        reject(new Error(String(error)));
      }

      return resolve(true);
    });
  });
};
