export class StorageService {
  static readonly USER_PREFIX = 'user_';
  static readonly USER_LIST_KEY = 'user_list';

  static addUser(key: string, user: any): void {
    localStorage.setItem(this.USER_PREFIX + key, JSON.stringify(user));
    this.addToUserList(key);
  }

  static getUser(key: string): any {
    const userStr = localStorage.getItem(this.USER_PREFIX + key);

    if (!userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user from storage:', error);
      return null;
    }
  }

  static removeUser(key: string): void {
    localStorage.removeItem(this.USER_PREFIX + key);
    this.removeFromUserList(key);
  }

  static clearAllUsers(): void {
    const userList = this.getUserList();
    userList.forEach(key => localStorage.removeItem(this.USER_PREFIX + key));
    localStorage.removeItem(this.USER_LIST_KEY);
  }

  static getUserList(): string[] {
    const userListStr = localStorage.getItem(this.USER_LIST_KEY);
    return userListStr ? JSON.parse(userListStr) : [];
  }

  private static addToUserList(key: string): void {
    const userList = this.getUserList();
    if (!userList.includes(key)) {
      userList.push(key);
      localStorage.setItem(this.USER_LIST_KEY, JSON.stringify(userList));
    }
  }

  private static removeFromUserList(key: string): void {
    let userList = this.getUserList();
    userList = userList.filter(item => item !== key);
    localStorage.setItem(this.USER_LIST_KEY, JSON.stringify(userList));
  }
}