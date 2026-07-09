import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CuentaClienteEntity } from './cuenta_cliente.entity';
import { MetodoPagoClienteEntity } from './metodo_pago_cliente.entity';
import { VentaEntity } from './venta.entity';

@Entity({ name: 'cliente' })
@Index('cliente_cedula_clie_key', ['cedulaClie'], { unique: true })
export class ClienteEntity {
  @PrimaryGeneratedColumn({ name: 'ide_clie' })
  ideClie!: number;

  @Column({ name: 'cedula_clie', type: 'varchar', length: 15 })
  cedulaClie!: string;

  @Column({ name: 'fecha_nacimiento_clie', type: 'date' })
  fechaNacimientoClie!: Date;

  @Column({ name: 'edad_clie', type: 'int' })
  edadClie!: number;

  @Column({ name: 'telefono_clie', type: 'varchar', length: 15 })
  telefonoClie!: string;

  @Column({ name: 'primer_nombre_clie', type: 'varchar', length: 50 })
  primerNombreClie!: string;

  @Column({ name: 'apellido_paterno_clie', type: 'varchar', length: 50 })
  apellidoPaternoClie!: string;

  @Column({ name: 'email_clie', type: 'varchar', length: 100 })
  emailClie!: string;

  @Column({ name: 'es_socio', type: 'varchar', length: 2 })
  esSocio!: 'si' | 'no';

  @Column({ name: 'es_tercera_edad', type: 'varchar', length: 2 })
  esTerceraEdad!: 'si' | 'no';

  @Column({
    name: 'segundo_nombre_clie',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  segundoNombreClie?: string | null;

  @Column({
    name: 'apellido_materno_clie',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  apellidoMaternoClie?: string | null;

  @Column({ name: 'usua_ingre', type: 'varchar', length: 25 })
  usuaIngre!: string;

  @Column({
    name: 'fecha_ingre',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaIngre!: Date;

  @Column({ name: 'usua_actua', type: 'varchar', length: 25, nullable: true })
  usuaActua?: string | null;

  @Column({ name: 'fecha_actua', type: 'timestamp', nullable: true })
  fechaActua?: Date | null;

  @OneToMany(() => VentaEntity, (venta) => venta.cliente)
  ventas?: VentaEntity[];

  @OneToMany(
    () => CuentaClienteEntity,
    (cuentaCliente) => cuentaCliente.cliente,
  )
  cuentasCliente?: CuentaClienteEntity[];

  @OneToMany(() => MetodoPagoClienteEntity, (metodoPago) => metodoPago.cliente)
  metodosPago?: MetodoPagoClienteEntity[];
}

export { ClienteEntity as Cliente };
