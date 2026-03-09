import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Storage {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getOrCreate<T>(key: string, data: T): T {
    if (!isPlatformBrowser(this.platformId)) return data;

    try {
      const value = localStorage.getItem(key);
      if (value && value !== 'undefined') {
        return JSON.parse(value) as T;
      }
    } catch (e) {
      console.warn(`getOrCreate data for key: ${key}`, e);
    }

    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  get<T>(key: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  }

  set<T>(key: string, data: T): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  remove(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
}
