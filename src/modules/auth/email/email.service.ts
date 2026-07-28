import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarRecuperacionPassword(
    correo: string,
    usuario: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = (
      process.env.FRONTEND_URL || 'http://localhost:4200'
    ).replace(/\/+$/, '');

    const url =
      `${frontendUrl}/reset-password` + `?token=${encodeURIComponent(token)}`;

    const usuarioSeguro = this.escapeHtml(usuario);
    const urlSegura = this.escapeHtml(url);

    await this.mailerService.sendMail({
      to: correo,
      subject: 'Recuperación de contraseña - SuperMarket',
      html: `
        <h2>Recuperación de contraseña</h2>

        <p>Hola <strong>${usuarioSeguro}</strong>.</p>

        <p>
          Recibimos una solicitud para restablecer
          la contraseña de tu cuenta.
        </p>

        <p>
          <a href="${urlSegura}">
            Restablecer contraseña
          </a>
        </p>

        <p>
          Este enlace será válido durante 15 minutos
          y solo podrá utilizarse una vez.
        </p>

        <p>
          Si no realizaste esta solicitud,
          puedes ignorar este mensaje.
        </p>
      `,
    });
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
