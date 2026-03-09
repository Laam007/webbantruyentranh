import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getStats() {
    return forkJoin({
      users: this.http.get<any[]>(`${this.api}/users`),
      customers: this.http.get<any[]>(`${this.api}/customers`),
      orders: this.http.get<any[]>(`${this.api}/orders`),
      books: this.http.get<any[]>(`${this.api}/books`)
    }).pipe(
      map(({ users, customers, orders, books }) => {
        const totalUsers = users.length + customers.length;

        const totalRevenue = orders.reduce(
          (sum, o) => sum + (o.total || 0),
          0
        );

        const totalOrders = orders.length;

        const lowStock = books.filter(b => b.stock <= 10).length;

        return {
          totalUsers,
          totalRevenue,
          totalOrders,
          lowStock
        };
      })
    );
  }
}
