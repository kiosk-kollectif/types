import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<number>('SMTP_PORT')),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  private loadTemplate(
    templateName: string,
    replacements: Record<string, string>,
  ): string {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.html`,
    );

    // En développement (src), le chemin peut être différent de dist
    const altPath = path.join(
      process.cwd(),
      'src',
      'mailer',
      'templates',
      `${templateName}.html`,
    );

    let content = '';
    if (fs.existsSync(templatePath)) {
      content = fs.readFileSync(templatePath, 'utf8');
    } else if (fs.existsSync(altPath)) {
      content = fs.readFileSync(altPath, 'utf8');
    } else {
      throw new Error(`Template email non trouvé : ${templateName}`);
    }

    Object.keys(replacements).forEach((key) => {
      content = content.replace(
        new RegExp(`{{${key}}}`, 'g'),
        replacements[key],
      );
    });

    return content;
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    const mailOptions = {
      from: 'testmailforprojectKioskKollectif@gmail.com',
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendManagerInvitation(
    email: string,
    username: string,
    password: string,
  ) {
    const loginUrl = 'https://kiosk-kollectif.vercel.app/login';
    const subject = 'Bienvenue sur Kiosk Kollectif - Vos accès Manager';

    const html = this.loadTemplate('manager-invitation', {
      username,
      email,
      password,
      loginUrl,
    });

    const text = `Bonjour ${username},\n\nVotre compte Manager a été créé.\n\nIdentifiants :\nEmail: ${email}\nMot de passe: ${password}`;

    await this.sendMail(email, subject, text, html);
  }

  async sendPasswordResetMail(email: string, code: string) {
    const subject = 'Réinitialisation de votre mot de passe';
    const resetUrl = `https://kiosk-kollectif.vercel.app/reset-password?code=${code}`;

    const html = this.loadTemplate('password-reset', { resetUrl });
    const text = `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`;

    await this.sendMail(email, subject, text, html);
  }

  async sendAccountConfirmationMail(email: string, code: number) {
    const subject = 'Vérification de votre email';

    const html = this.loadTemplate('account-verification', {
      code: code.toString(),
    });
    const text = `Votre code de vérification est ${code}`;

    await this.sendMail(email, subject, text, html);
  }
}
