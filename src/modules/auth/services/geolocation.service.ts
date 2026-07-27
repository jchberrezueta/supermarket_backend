import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeolocationService {
  async buscar(ip: string) {
    try {
      const { data } = await axios.get(
        `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,isp,org,timezone`,
      );

      if (data.status !== 'success') {
        return null;
      }

      return {
        pais: data.country,
        provincia: data.regionName,
        ciudad: data.city,
        latitud: data.lat,
        longitud: data.lon,
        isp: data.isp,
        organizacion: data.org,
        timezone: data.timezone,
      };
    } catch {
      return null;
    }
  }
}
