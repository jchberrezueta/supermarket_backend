export class EmpresaResponseDTO {
  id:number;
  nombre:string;
  responsable:string;
  fechaContrato:string;
  direccion:Date;
  telefono:string;
  email:string;
  estado:string;
  descripcion?:string;
}