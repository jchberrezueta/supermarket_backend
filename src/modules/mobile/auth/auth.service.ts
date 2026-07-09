import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClienteEntity, CuentaClienteEntity } from '@entities';
import { DataSource, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginClienteDto, RegisterClienteDto } from './dto';

@Injectable()
export class MobileAuthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registro de cliente móvil.
   *
   * Contrato original:
   * - No recibe usuarioClie.
   * - Usa emailClie como usuario interno de cuenta_cliente.
   */
  async register(dto: RegisterClienteDto) {
    const body = dto as any;

    this.validarRegistro(body);

    const passwordPlano = String(body.password).trim();

    const resultado = await this.dataSource.transaction(async (manager) => {
      await this.validarDuplicadosRegistro(body, manager);

      const clienteRepository = manager.getRepository(ClienteEntity);
      const cuentaRepository = manager.getRepository(CuentaClienteEntity);

      const fechaNacimiento = new Date(body.fechaNacimientoClie);

      const cliente = clienteRepository.create({
        cedulaClie: body.cedulaClie,
        fechaNacimientoClie: fechaNacimiento,
        edadClie: Number(body.edadClie),
        telefonoClie: body.telefonoClie,
        primerNombreClie: body.primerNombreClie,
        segundoNombreClie: body.segundoNombreClie ?? null,
        apellidoPaternoClie: body.apellidoPaternoClie,
        apellidoMaternoClie: body.apellidoMaternoClie ?? null,
        emailClie: body.emailClie,
        esSocio: body.esSocio ?? 'no',
        esTerceraEdad: body.esTerceraEdad ?? 'no',
        usuaIngre: 'mobile',
      });

      const clienteGuardado = await clienteRepository.save(cliente);

      const cuenta = cuentaRepository.create({
        ideClie: clienteGuardado.ideClie,
        usuarioClie: body.emailClie,
        emailClie: body.emailClie,
        passwordClie: await bcrypt.hash(passwordPlano, 10),
        estadoClie: true,
      });

      const cuentaGuardada = await cuentaRepository.save(cuenta);

      return {
        cliente: clienteGuardado,
        cuenta: cuentaGuardada,
      };
    });

    return {
      success: true,
      message: 'Cliente registrado correctamente.',
      data: {
        ideClie: resultado.cliente.ideClie,
        ideCuenClie: resultado.cuenta.ideCuenClie,
        cedulaClie: resultado.cliente.cedulaClie,
        primerNombreClie: resultado.cliente.primerNombreClie,
        segundoNombreClie: resultado.cliente.segundoNombreClie,
        apellidoPaternoClie: resultado.cliente.apellidoPaternoClie,
        apellidoMaternoClie: resultado.cliente.apellidoMaternoClie,
        emailClie: resultado.cliente.emailClie,
        usuarioClie: resultado.cuenta.usuarioClie,
      },
    };
  }

  /**
   * Login de cliente móvil.
   *
   * Contrato original:
   * - usuario
   * - clave
   * - numIntentos
   *
   * El campo usuario puede ser:
   * - usuario_clie
   * - email_clie
   */
  async login(dto: LoginClienteDto) {
    const body = dto as any;

    const usuario = String(body.usuario ?? '').trim();
    const clave = String(body.clave ?? '');

    if (!usuario || !clave) {
      throw new BadRequestException(
        'Debe ingresar usuario/correo y contraseña.',
      );
    }

    const cuenta = await this.dataSource.transaction((manager) =>
      this.buscarCuentaParaLogin(usuario, manager),
    );

    if (!cuenta) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (!cuenta.estadoClie) {
      throw new UnauthorizedException('La cuenta del cliente no está activa.');
    }

    const passwordValida = await bcrypt.compare(clave, cuenta.passwordClie);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const cliente = cuenta.cliente;

    if (!cliente) {
      throw new UnauthorizedException(
        'La cuenta no tiene un cliente asociado.',
      );
    }

    const payload = {
      sub: cuenta.ideCuenClie,
      ide_cuen_clie: cuenta.ideCuenClie,
      ide_clie: cliente.ideClie,
      username: cuenta.usuarioClie,
      email: cuenta.emailClie,
      role: 'cliente',
      tipo_usuario: 'cliente',
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Inicio de sesión correcto.',

      /**
       * Se devuelven ambos nombres para compatibilidad:
       * - access_token: estándar actual
       * - token: compatibilidad con clientes anteriores
       */
      access_token: token,
      token,
      token_type: 'Bearer',

      user: {
        ideCuenClie: cuenta.ideCuenClie,
        ideClie: cliente.ideClie,
        usuarioClie: cuenta.usuarioClie,
        emailClie: cuenta.emailClie,
        primerNombreClie: cliente.primerNombreClie,
        segundoNombreClie: cliente.segundoNombreClie,
        apellidoPaternoClie: cliente.apellidoPaternoClie,
        apellidoMaternoClie: cliente.apellidoMaternoClie,
        nombreCompleto: this.obtenerNombreCompleto(cliente),
        role: 'cliente',
      },

      /**
       * También se incluye snake_case por compatibilidad con payloads antiguos.
       */
      usuario: {
        ide_cuen_clie: cuenta.ideCuenClie,
        ide_clie: cliente.ideClie,
        usuario_clie: cuenta.usuarioClie,
        email_clie: cuenta.emailClie,
        primer_nombre_clie: cliente.primerNombreClie,
        segundo_nombre_clie: cliente.segundoNombreClie,
        apellido_paterno_clie: cliente.apellidoPaternoClie,
        apellido_materno_clie: cliente.apellidoMaternoClie,
        nombre_completo: this.obtenerNombreCompleto(cliente),
        role: 'cliente',
      },
    };
  }

  private async validarDuplicadosRegistro(
    body: any,
    manager: EntityManager,
  ): Promise<void> {
    const clienteRepository = manager.getRepository(ClienteEntity);
    const cuentaRepository = manager.getRepository(CuentaClienteEntity);

    const clienteCedula = await clienteRepository.findOne({
      where: {
        cedulaClie: body.cedulaClie,
      },
    });

    if (clienteCedula) {
      throw new BadRequestException(
        'Ya existe un cliente registrado con esa cédula.',
      );
    }

    const clienteEmail = await clienteRepository.findOne({
      where: {
        emailClie: body.emailClie,
      },
    });

    if (clienteEmail) {
      throw new BadRequestException(
        'Ya existe un cliente registrado con ese correo.',
      );
    }

    const cuentaUsuario = await cuentaRepository.findOne({
      where: {
        usuarioClie: body.emailClie,
      },
    });

    if (cuentaUsuario) {
      throw new BadRequestException(
        'Ya existe una cuenta registrada con ese usuario.',
      );
    }

    const cuentaEmail = await cuentaRepository.findOne({
      where: {
        emailClie: body.emailClie,
      },
    });

    if (cuentaEmail) {
      throw new BadRequestException(
        'Ya existe una cuenta registrada con ese correo.',
      );
    }
  }

  private async buscarCuentaParaLogin(
    usuario: string,
    manager: EntityManager,
  ): Promise<CuentaClienteEntity | null> {
    return manager
      .getRepository(CuentaClienteEntity)
      .createQueryBuilder('cuenta')
      .leftJoinAndSelect('cuenta.cliente', 'cliente')
      .where('LOWER(cuenta.usuarioClie) = LOWER(:usuario)', { usuario })
      .orWhere('LOWER(cuenta.emailClie) = LOWER(:usuario)', { usuario })
      .getOne();
  }

  private validarRegistro(body: any): void {
    const camposRequeridos = [
      'cedulaClie',
      'fechaNacimientoClie',
      'edadClie',
      'telefonoClie',
      'primerNombreClie',
      'apellidoPaternoClie',
      'emailClie',
      'password',
      'esSocio',
      'esTerceraEdad',
    ];

    for (const campo of camposRequeridos) {
      if (
        body[campo] === null ||
        body[campo] === undefined ||
        String(body[campo]).trim() === ''
      ) {
        throw new BadRequestException(`El campo ${campo} es obligatorio.`);
      }
    }

    if (!Number.isInteger(Number(body.edadClie)) || Number(body.edadClie) < 1) {
      throw new BadRequestException('La edad del cliente no es válida.');
    }

    const fechaNacimiento = new Date(body.fechaNacimientoClie);

    if (Number.isNaN(fechaNacimiento.getTime())) {
      throw new BadRequestException(
        'La fecha de nacimiento del cliente no es válida.',
      );
    }

    if (String(body.password).trim().length < 6) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 6 caracteres.',
      );
    }
  }

  private obtenerNombreCompleto(cliente: ClienteEntity): string {
    return [
      cliente.primerNombreClie,
      cliente.segundoNombreClie,
      cliente.apellidoPaternoClie,
      cliente.apellidoMaternoClie,
    ]
      .filter((value) => !!value)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
