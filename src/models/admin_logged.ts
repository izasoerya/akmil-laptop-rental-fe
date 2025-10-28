export interface AdminLogged {
  id: number;
  username: string;
  email: string;
  password: string;
}

class AdminLoggedSingleton {
  private static instance: AdminLoggedSingleton;
  private admin: AdminLogged | null = null;
  private readonly STORAGE_KEY = "admin_logged";

  private constructor() {
    // Load admin from localStorage on initialization
    this.loadFromStorage();
  }

  public static getInstance(): AdminLoggedSingleton {
    if (!AdminLoggedSingleton.instance) {
      AdminLoggedSingleton.instance = new AdminLoggedSingleton();
    }
    return AdminLoggedSingleton.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.admin = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading admin from storage:", error);
    }
  }

  private saveToStorage(): void {
    try {
      if (this.admin) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.admin));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving admin to storage:", error);
    }
  }

  public setAdmin(admin: AdminLogged): void {
    this.admin = admin;
    this.saveToStorage();
  }

  public getAdmin(): AdminLogged | null {
    return this.admin;
  }

  public clearAdmin(): void {
    this.admin = null;
    this.saveToStorage();
  }

  public isLoggedIn(): boolean {
    return this.admin !== null;
  }
}

export default AdminLoggedSingleton.getInstance();
