import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateClienteDTO } from './dto/create_cliente.dto';
import { FilterClienteDTO } from './dto/filter_cliente.dto';
import { UpdateClienteDTO } from './dto/update_cliente.dto';

@Injectable()
export class ClientesRepository {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly clienteRepository: Repository<ClienteEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<ClienteEntity[]> {
    return this.getRepository(manager).find({
      order: {
        apellidoPaternoClie: 'ASC',
        primerNombreClie: 'ASC',
      },
    });
  }

  async listarConCuenta(manager?: EntityManager): Promise<ClienteEntity[]> {
    return this.getRepository(manager).find({
      relations: {
        cuentasCliente: true,
      },
      order: {
        apellidoPaternoClie: 'ASC',
        primerNombreClie: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideClie: number,
    manager?: EntityManager,
  ): Promise<ClienteEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        ideClie,
      },
      relations: {
        cuentasCliente: true,
      },
    });
  }

  async filtrar(
    filtros: FilterClienteDTO,
    manager?: EntityManager,
  ): Promise<ClienteEntity[]> {
    const qb = this.getRepository(manager)
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.cuentasCliente', 'cuentaCliente')
      .orderBy('cliente.apellidoPaternoClie', 'ASC')
      .addOrderBy('cliente.primerNombreClie', 'ASC');

    if (filtros.cedulaClie) {
      qb.andWhere('cliente.cedulaClie = :cedulaClie', {
        cedulaClie: filtros.cedulaClie,
      });
    }

    if (filtros.primerNombreClie) {
      qb.andWhere(
        'LOWER(cliente.primerNombreClie) LIKE LOWER(:primerNombreClie)',
        {
          primerNombreClie: `%${filtros.primerNombreClie}%`,
        },
      );
    }

    if (filtros.apellidoPaternoClie) {
      qb.andWhere(
        'LOWER(cliente.apellidoPaternoClie) LIKE LOWER(:apellidoPaternoClie)',
        {
          apellidoPaternoClie: `%${filtros.apellidoPaternoClie}%`,
        },
      );
    }

    if (filtros.esSocio) {
      qb.andWhere('cliente.esSocio = :esSocio', {
        esSocio: filtros.esSocio,
      });
    }

    if (filtros.esTerceraEdad) {
      qb.andWhere('cliente.esTerceraEdad = :esTerceraEdad', {
        esTerceraEdad: filtros.esTerceraEdad,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateClienteDTO,
    manager?: EntityManager,
  ): Promise<ClienteEntity> {
    const repository = this.getRepository(manager);

    const cliente = repository.create({
      cedulaClie: dto.cedulaClie,
      fechaNacimientoClie: new Date(dto.fechaNacimientoClie),
      edadClie: dto.edadClie,
      telefonoClie: dto.telefonoClie,
      primerNombreClie: dto.primerNombreClie,
      apellidoPaternoClie: dto.apellidoPaternoClie,
      emailClie: dto.emailClie,
      esSocio: dto.esSocio,
      esTerceraEdad: dto.esTerceraEdad,
      segundoNombreClie: dto.segundoNombreClie ?? null,
      apellidoMaternoClie: dto.apellidoMaternoClie ?? null,
      usuaIngre: 'admin',
    });

    return repository.save(cliente);
  }

  async actualizar(
    cliente: ClienteEntity,
    dto: UpdateClienteDTO,
    manager?: EntityManager,
  ): Promise<ClienteEntity> {
    cliente.cedulaClie = dto.cedulaClie;
    cliente.fechaNacimientoClie = new Date(dto.fechaNacimientoClie);
    cliente.edadClie = dto.edadClie;
    cliente.telefonoClie = dto.telefonoClie;
    cliente.primerNombreClie = dto.primerNombreClie;
    cliente.apellidoPaternoClie = dto.apellidoPaternoClie;
    cliente.emailClie = dto.emailClie;
    cliente.esSocio = dto.esSocio;
    cliente.esTerceraEdad = dto.esTerceraEdad;
    cliente.segundoNombreClie = dto.segundoNombreClie ?? null;
    cliente.apellidoMaternoClie = dto.apellidoMaternoClie ?? null;
    cliente.usuaActua = 'admin';
    cliente.fechaActua = new Date();

    return this.getRepository(manager).save(cliente);
  }

  async eliminar(ideClie: number, manager?: EntityManager): Promise<number> {
    const result = await this.getRepository(manager).delete({
      ideClie,
    });

    return result.affected ?? 0;
  }

  async buscarPorCedula(
    cedulaClie: string,
    manager?: EntityManager,
  ): Promise<ClienteEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        cedulaClie,
      },
    });
  }

  private getRepository(manager?: EntityManager): Repository<ClienteEntity> {
    if (manager) {
      return manager.getRepository(ClienteEntity);
    }

    return this.clienteRepository;
  }
}
