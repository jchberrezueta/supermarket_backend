import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresaEntity, EmpresaPreciosEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { MoneyUtil } from '@common/utils/money.util';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { CreateEmpresaPrecioDTO } from './dto/create_precio.dto';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { UpdateEmpresaPrecioDTO } from './dto/update_precio.dto';

@Injectable()
export class EmpresasRepository {
  constructor(
    @InjectRepository(EmpresaEntity)
    private readonly empresaRepository: Repository<EmpresaEntity>,
    @InjectRepository(EmpresaPreciosEntity)
    private readonly empresaPreciosRepository: Repository<EmpresaPreciosEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<EmpresaEntity[]> {
    return this.getEmpresaRepository(manager).find({
      order: {
        nombreEmpr: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideEmpr: number,
    manager?: EntityManager,
  ): Promise<EmpresaEntity | null> {
    return this.getEmpresaRepository(manager).findOne({
      where: {
        ideEmpr,
      },
    });
  }

  async filtrar(
    filtros: FilterEmpresaDTO,
    manager?: EntityManager,
  ): Promise<EmpresaEntity[]> {
    const qb = this.getEmpresaRepository(manager)
      .createQueryBuilder('empresa')
      .orderBy('empresa.nombreEmpr', 'ASC');

    if (filtros.nombreEmp) {
      qb.andWhere('LOWER(empresa.nombreEmpr) LIKE LOWER(:nombreEmp)', {
        nombreEmp: `%${filtros.nombreEmp}%`,
      });
    }

    if (filtros.estadoEmp) {
      qb.andWhere('empresa.estadoEmpr = :estadoEmp', {
        estadoEmp: filtros.estadoEmp,
      });
    }

    if (filtros.responsableEmp) {
      qb.andWhere(
        'LOWER(empresa.responsableEmpr) LIKE LOWER(:responsableEmp)',
        {
          responsableEmp: `%${filtros.responsableEmp}%`,
        },
      );
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateEmpresaDTO,
    manager?: EntityManager,
  ): Promise<EmpresaEntity> {
    const repository = this.getEmpresaRepository(manager);

    const empresa = repository.create({
      nombreEmpr: dto.nombreEmp,
      responsableEmpr: dto.responsableEmp,
      fechaContratoEmpr: new Date(dto.fechaContratoEmp),
      direccionEmpr: dto.direccionEmp,
      telefonoEmpr: dto.telefonoEmp,
      emailEmpr: dto.emailEmp,
      estadoEmpr: dto.estadoEmp as EmpresaEntity['estadoEmpr'],
      descripcionEmpr: dto.descripcionEmp,
      usuaIngre: 'admin',
    });

    return repository.save(empresa);
  }

  async actualizar(
    empresa: EmpresaEntity,
    dto: UpdateEmpresaDTO,
    manager?: EntityManager,
  ): Promise<EmpresaEntity> {
    empresa.nombreEmpr = dto.nombreEmp;
    empresa.responsableEmpr = dto.responsableEmp;
    empresa.fechaContratoEmpr = new Date(dto.fechaContratoEmp);
    empresa.direccionEmpr = dto.direccionEmp;
    empresa.telefonoEmpr = dto.telefonoEmp;
    empresa.emailEmpr = dto.emailEmp;
    empresa.estadoEmpr = dto.estadoEmp as EmpresaEntity['estadoEmpr'];
    empresa.descripcionEmpr = dto.descripcionEmp;
    empresa.usuaActua = 'admin';
    empresa.fechaActua = new Date();

    return this.getEmpresaRepository(manager).save(empresa);
  }

  async eliminar(ideEmpr: number, manager?: EntityManager): Promise<number> {
    const result = await this.getEmpresaRepository(manager).delete({
      ideEmpr,
    });

    return result.affected ?? 0;
  }

  async listarActivas(manager?: EntityManager): Promise<EmpresaEntity[]> {
    return this.getEmpresaRepository(manager).find({
      where: {
        estadoEmpr: 'activo',
      },
      order: {
        nombreEmpr: 'ASC',
      },
    });
  }

  /**
   * EMPRESA PRECIOS
   */
  async listarPrecios(
    manager?: EntityManager,
  ): Promise<EmpresaPreciosEntity[]> {
    return this.getEmpresaPreciosRepository(manager).find({
      relations: {
        empresa: true,
        producto: true,
      },
      order: {
        ideEmpr: 'ASC',
        ideProd: 'ASC',
      },
    });
  }

  async listarPreciosPorEmpresa(
    ideEmpr: number,
    manager?: EntityManager,
  ): Promise<EmpresaPreciosEntity[]> {
    return this.getEmpresaPreciosRepository(manager).find({
      where: {
        ideEmpr,
      },
      relations: {
        empresa: true,
        producto: true,
      },
      order: {
        ideProd: 'ASC',
      },
    });
  }

  async crearPrecio(
    dto: CreateEmpresaPrecioDTO,
    manager?: EntityManager,
  ): Promise<EmpresaPreciosEntity> {
    const repository = this.getEmpresaPreciosRepository(manager);

    const precio = repository.create({
      ideEmpr: dto.ideEmpr,
      ideProd: dto.ideProd,
      precioCompraProd: MoneyUtil.toMoneyString(dto.precioCompraProd),
      dctoCompraProd: MoneyUtil.toMoneyString(dto.dctoCompraProd),
      dctoCaducidadProd: MoneyUtil.toMoneyString(dto.dctoCaducidadProd),
      ivaProd: MoneyUtil.toMoneyString(dto.ivaProd),
      usuaIngre: 'admin',
    });

    return repository.save(precio);
  }

  async buscarPrecioPorId(
    ideEmprProd: number,
    manager?: EntityManager,
  ): Promise<EmpresaPreciosEntity | null> {
    return this.getEmpresaPreciosRepository(manager).findOne({
      where: {
        ideEmprProd,
      },
    });
  }

  async actualizarPrecio(
    precio: EmpresaPreciosEntity,
    dto: UpdateEmpresaPrecioDTO,
    manager?: EntityManager,
  ): Promise<EmpresaPreciosEntity> {
    precio.ideEmpr = dto.ideEmpr;
    precio.ideProd = dto.ideProd;
    precio.precioCompraProd = MoneyUtil.toMoneyString(dto.precioCompraProd);
    precio.dctoCompraProd = MoneyUtil.toMoneyString(dto.dctoCompraProd);
    precio.dctoCaducidadProd = MoneyUtil.toMoneyString(dto.dctoCaducidadProd);
    precio.ivaProd = MoneyUtil.toMoneyString(dto.ivaProd);
    precio.usuaActua = 'admin';
    precio.fechaActua = new Date();

    return this.getEmpresaPreciosRepository(manager).save(precio);
  }

  private getEmpresaRepository(
    manager?: EntityManager,
  ): Repository<EmpresaEntity> {
    if (manager) {
      return manager.getRepository(EmpresaEntity);
    }

    return this.empresaRepository;
  }

  private getEmpresaPreciosRepository(
    manager?: EntityManager,
  ): Repository<EmpresaPreciosEntity> {
    if (manager) {
      return manager.getRepository(EmpresaPreciosEntity);
    }

    return this.empresaPreciosRepository;
  }
}
