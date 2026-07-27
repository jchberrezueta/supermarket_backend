import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarRecuperacionPassword(
    correo: string,
    usuario: string,
    token: string,
  ) {
    const url = `http://localhost:4200/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: correo,

      subject: 'Recuperación de contraseña - Sistema SIG',

      html: `
        <h2>Recuperación de contraseña</h2>

        <p>
          Hola <b>${usuario}</b>.
        </p>

        <p>
          Hemos recibido una solicitud para cambiar tu contraseña.
        </p>

        <p>
          Ingresa al siguiente enlace:
        </p>

        <a href="${url}">
          Restablecer contraseña
        </a>

        <p>
          Este enlace tiene tiempo limitado.
        </p>

        <p>
          Si no realizaste esta solicitud,
          puedes ignorar este correo.
        </p>
      `,
    });
  }
}
