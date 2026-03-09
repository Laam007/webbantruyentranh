import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from './storage.service';
import { Users, Customer } from '../interface/model';
import { CustomerService } from './customers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // 👈 Đường dẫn tới JSON Server

  user = signal<Users | null>(null);
  users = signal<Users[]>([]);

  constructor(
    private http: HttpClient, // 👈 thêm vào
    private storageService: Storage,
    private router: Router,
    private customerService: CustomerService
  ) {
    const savedUser = this.storageService.get<Users>('currentUser');
    this.user.set(savedUser ?? null);

    // 🟢 Tải danh sách user từ API khi khởi tạo
    this.loadUsers();
  }

  /** Tải user từ db.json (API) */
  loadUsers() {
    this.http.get<Users[]>(this.apiUrl).subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('❌ Không thể tải users từ API:', err)
    });
  }

  /** Đăng nhập */
  Signin(username: string, password: string): boolean {
    const foundUser = this.users().find(
      (u) => u.username === username && u.password === password
    );

    const foundCustomer = this.customerService
      .getCustomers()
      .find((c) => c.username === username && c.password === password);

    const found = foundUser || foundCustomer;

    if (!found) return false;

    if (found.islocked) {
      alert('Tài khoản của bạn đã bị khóa.');
      return false;
    }

    const currentUser = {
      id: found.id,
      username: found.username,
      role: found.role ?? 'customer',
      permissions: 'permissions' in found ? found.permissions : []
    };

    this.storageService.set('currentUser', currentUser);
    this.user.set(currentUser as any);

    return true;
  }

  logout(): void {
    this.storageService.remove('currentUser');
    this.user.set(null);
    this.router.navigate(['/signin']);
  }

  getCurrentUser(): Users | null {
    return this.user();
  }

  getCurrentUserRole(): string | null {
    return this.user()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) ?? false;
  }
}
