// ✅ src/app/services/employees.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employees, Users } from '../interface/model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000'; // json-server

  users = signal<Users[]>([]);
  employees = signal<Employees[]>([]);

  constructor(private http: HttpClient) {
    this.loadData();
  }

  // 🟢 Tải dữ liệu từ API json-server
  private loadData() {
    this.http.get<Users[]>(`${this.apiUrl}/users`).subscribe((data) => {
      this.users.set(data);
    });
    this.http.get<Employees[]>(`${this.apiUrl}/employees`).subscribe((data) => {
      this.employees.set(data);
    });
  }

  // ========== USERS ========== //
  getUsers() {
    return this.users();
  }

  getUserById(id: string): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: Users): void {
    this.http.post<Users>(`${this.apiUrl}/users`, user).subscribe((newUser) => {
      this.users.update((list) => [...list, newUser]);
    });
  }

  updateUser(user: Users): void {
    this.http.put<Users>(`${this.apiUrl}/users/${user.id}`, user).subscribe((updated) => {
      this.users.update((list) => list.map((u) => (u.id === user.id ? updated : u)));
    });
  }

  deleteUserId(id: string): void {
    this.http.delete(`${this.apiUrl}/users/${id}`).subscribe(() => {
      this.users.update((list) => list.filter((u) => u.id !== id));
    });
  }

  // ========== EMPLOYEES ========== //
  getEmployees() {
    return this.employees();
  }

  getEmployeeById(id: string): Observable<Employees> {
    return this.http.get<Employees>(`${this.apiUrl}/employees/${id}`);
  }

  createEmployee(employee: Employees): void {
    this.http.post<Employees>(`${this.apiUrl}/employees`, employee).subscribe((newEmp) => {
      this.employees.update((list) => [...list, newEmp]);
    });
  }

  updateEmployee(employee: Employees): void {
    if (!employee.id) return;
    this.http.patch<Employees>(`${this.apiUrl}/employees/${employee.id}`, employee)
      .subscribe((updatedEmp) => {
        this.employees.update((list) =>
          list.map((e) => (e.id === employee.id ? { ...e, ...updatedEmp } : e))
        );
      });
  }

  deleteEmployeeId(id: string): void {
    this.http.delete(`${this.apiUrl}/employees/${id}`).subscribe(() => {
      this.employees.update((list) => list.filter((e) => e.id !== id));
    });
  }
}
