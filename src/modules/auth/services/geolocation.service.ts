import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface IpApiResponse {
  status: 'success' | 'fail';
  message?: string;
  country?: string;
  regionName?: string;
  city?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  org?: string;
  timezone?: string;
  query?: string;
}

@Injectable()
export class GeolocationService {
  async buscar(ip: string) {
    const ipLimpia = this.normalizarIp(ip);

    if (!ipLimpia || this.esIpLocal(ipLimpia)) {
      return null;
    }

    try {
      const { data } = await axios.get<IpApiResponse>(
        `http://ip-api.com/json/${encodeURIComponent(ipLimpia)}`,
        {
          params: {
            fields:
              'status,message,query,country,regionName,city,lat,lon,isp,org,timezone',
            lang: 'es',
          },
          timeout: 3000,
        },
      );

      if (
        data.status !== 'success' ||
        typeof data.lat !== 'number' ||
        typeof data.lon !== 'number'
      ) {
        return null;
      }

      return {
        pais: data.country ?? null,
        provincia: data.regionName ?? null,
        ciudad: data.city ?? null,
        latitud: data.lat,
        longitud: data.lon,
        isp: data.isp ?? null,
        organizacion: data.org ?? null,
        timezone: data.timezone ?? null,
      };
    } catch {
      return null;
    }
  }

  private normalizarIp(ip: string): string {
    const valor = ip?.trim();

    if (!valor) {
      return '';
    }

    if (valor.startsWith('::ffff:')) {
      return valor.substring(7);
    }

    return valor;
  }

  private esIpLocal(ip: string): boolean {
    return (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip === 'localhost' ||
      ip.startsWith('10.') ||
      ip.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
    );
  }
}
