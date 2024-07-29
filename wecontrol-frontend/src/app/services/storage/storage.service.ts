export class StorageService {
  static setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem(key: string): any {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }

    try {
      return JSON.parse(itemStr);
    } catch (error) {
      console.error('Failed to parse item from storage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
