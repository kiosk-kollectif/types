import * as nodemailer from 'nodemailer';

export const sendAccountConfirmationMail = async (
  email: string,
  code: number,
): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
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
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
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
