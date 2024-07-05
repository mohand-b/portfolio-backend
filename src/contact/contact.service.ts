import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';
import { ContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async sendContactMail(contactDto: ContactDto) {
    const { name, surname, email, subject, message } = contactDto;

    const templatePath = path.resolve(
      __dirname,
      '../../src/templates/contact-email.html',
    );
    let html: any;
    try {
      html = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error('Error reading HTML template:', error.message);
      throw new InternalServerErrorException('Error reading email template');
    }

    const now: Date = new Date();
    const date: string = now.toLocaleDateString('fr-FR');
    const time: string = now.toLocaleTimeString('fr-FR');

    html = html
      .replace('{{name}}', name)
      .replace('{{surname}}', surname)
      .replace('{{email}}', email)
      .replace('{{subject}}', subject)
      .replace('{{message}}', message)
      .replace('{{date}}', date)
      .replace('{{time}}', time);

    const recipient = this.configService.get<string>('MAIL_RECIPIENT');

    await this.mailService.sendMail(recipient, subject, html);
  }
}
