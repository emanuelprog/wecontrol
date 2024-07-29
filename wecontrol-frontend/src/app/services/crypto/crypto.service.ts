import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private secretKey = 'we-control';

  encrypt(value: string): string {
    const timestamp = Date.now();
    const data = `${value}:${timestamp}`;
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  decrypt(value: string): { email: string, timestamp: number } | null {
    try {
      const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const [email, timestamp] = decrypted.split(':');
      return { email, timestamp: parseInt(timestamp, 10) };
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(timestamp: number): boolean {
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - timestamp > fiveMinutes;
  }
}
