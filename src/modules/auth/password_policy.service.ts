import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordPolicyService {
  private readonly MIN_LENGTH = 8;

  validar(password: string): {
    valido: boolean;
    errores: string[];
  } {
    const errores: string[] = [];

    if (!password || password.length < this.MIN_LENGTH) {
      errores.push(
        `La contraseña debe tener mínimo ${this.MIN_LENGTH} caracteres`,
      );
    }

    if (!/[A-Z]/.test(password)) {
      errores.push('Debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(password)) {
      errores.push('Debe contener al menos una letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
      errores.push('Debe contener al menos un número');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errores.push('Debe contener al menos un carácter especial');
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }
}
