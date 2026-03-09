import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../interface/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';
  customers = signal<Customer[]>([]); // quản lý danh sách trong bộ nhớ tạm

  constructor(private http: HttpClient) {
    this.loadData();
  }

  // ✅ Load toàn bộ danh sách từ API
  private loadData(): void {
    this.http.get<Customer[]>(this.apiUrl).subscribe({
      next: data => this.customers.set(data),
      error: err => console.error('Lỗi tải dữ liệu:', err)
    });
  }

  // ✅ Lấy tất cả customer (từ signal)
  getCustomers(): Customer[] {
    return this.customers();
  }

  // ✅ Lấy 1 customer theo id
  getCustomerId(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // ✅ Tạo mới
  addCustomer(customer: Customer): void {
    this.http.post<Customer>(this.apiUrl, customer).subscribe({
      next: data => this.customers.update(list => [...list, data]),
      error: err => console.error('Lỗi thêm customer:', err)
    });
  }

  // ✅ Cập nhật
  updateCustomer(customer: Customer): void {
    this.http.patch<Customer>(`${this.apiUrl}/${customer.id}`, customer).subscribe({
      next: updated =>
        this.customers.update(list => list.map(c => (c.id === updated.id ? updated : c))),
      error: err => console.error('Lỗi cập nhật customer:', err)
    });
  }

  // ✅ Xóa
  removeCustomer(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () =>
        this.customers.update(list => list.filter(c => c.id !== id)),
      error: err => console.error('Lỗi xóa customer:', err)
    });
  }
}
