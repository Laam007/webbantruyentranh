// src/app/components/employees/employees.component.ts
import { Component, signal } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EMPLOYEES, Employees, Users } from '../interface/model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  editingId = signal<string | null>(null);
  newUser = signal<Users | null>(null);
  newEmployee = signal<Employees | null>(null);
  users = signal<Users[]>([]);
  employees = signal<Employees[]>([]);

  constructor(
    private employeeService: EmployeeService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.users = this.employeeService.users;
    this.employees = this.employeeService.employees;
  }

  getEmployee = (userId: string) =>
    this.employees().find((emp) => emp.id === userId);

  handleAdd() {
    const newId = (this.users().length + 1).toString();
    this.newUser.set({
      id: newId,
      username: '',
      password: '123456',
      role: 'user',
      islocked: false,
      permissions: []
    });
    this.newEmployee.set({
      id: newId,
      image: '/image/avatar.jpg',
      fullname: '',
      email: '',
      phone: '',
      address: ''
    });
    
  }

  // 🟢 Lưu mới hoặc cập nhật
  handleSave() {
    if (this.newUser() && this.newEmployee()) {
      // Dùng đúng tên hàm RESTful trong service
      this.employeeService.createUser(this.newUser()!);
      this.employeeService.createEmployee(this.newEmployee()!);

      this.newUser.set(null);
      this.newEmployee.set(null);
    } else if (this.editingId()) {
      const user = this.users().find((u) => u.id === this.editingId());
      const employee = this.employees().find((e) => e.id === this.editingId());
      if (user && employee) {
        this.employeeService.updateUser(user);
        this.employeeService.updateEmployee(employee);
      }
      this.editingId.set(null);
    }
  }

  handleEdit(id: string) {
    this.editingId.set(id);
  }

  handleCancel() {
    this.newUser.set(null);
    this.newEmployee.set(null);
    this.editingId.set(null);
  }

  handleDelete(id: string) {
    this.employeeService.deleteUserId(id);
    this.employeeService.deleteEmployeeId(id);
  }

  handleImageChange(event: any, id: string | undefined, isNew = false) {
    const file = event.target.files[0];
    if (!file) return;
    const imagePath = '/image/' + file.name;

    if (isNew && this.newEmployee()) {
      this.newEmployee.update((emp) =>
        emp ? { ...emp, image: imagePath } : emp
      );
    } else {
      this.employees.update((list) =>
        list.map((e) => (e.id === id ? { ...e, image: imagePath } : e))
      );
    }
  }
}
