import { Injectable, computed, signal } from '@angular/core';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { CustomerService } from './customers.service';
import { EmployeeService } from './employee.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, switchMap, tap } from 'rxjs';
import { Employees, Customer } from '../interface/model';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private apiUrl = 'http://localhost:3000/orders';
  orders = signal<any[]>([]);

  currentUser = computed(() => this.authService.user());

  userOrders = computed(() => {
    const user = this.currentUser();
    return user ? this.orders().filter(o => o.userId === user.id) : [];
  });

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private http: HttpClient
  ) {
    this.loadOrders();
  }

  /** Load orders từ API */
  loadOrders() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.orders.set(data));
  }

  /** Lấy orders dưới dạng readonly */
  getOrders() {
    return this.orders.asReadonly();
  }

  /** Lấy orders của user hiện tại */
  getUserOrders() {
    return this.userOrders();
  }

  /** Lấy các sản phẩm active trong giỏ của user */
  getActiveUserCarts() {
    const user = this.currentUser();
    return user
      ? this.cartService.getUserCart().filter(item => item.userId === user.id && item.active)
      : [];
  }

  /** Tính tổng tiền */
  calculateSubtotal(activeCarts: any[]): number {
    return activeCarts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /** Thêm đơn hàng mới */
  addOrder(order: any) {
    const newOrder = {
      ...order,
      createdAt: new Date().toISOString(),
      isNew: order.isNew ?? true
    };
    this.http.post<any>(this.apiUrl, newOrder)
      .pipe(tap(res => this.orders.update(items => [...items, res])))
      .subscribe();
  }

  /** Checkout giỏ hàng */
  checkout(data: any = {}) {  // data là tùy chọn
    const user = this.currentUser();
    if (!user) {
      alert('Vui lòng đăng nhập để thanh toán!');
      return;
    }

    const activeCarts = this.getActiveUserCarts();
    if (activeCarts.length === 0) {
      alert('Chưa có sản phẩm nào được chọn để thanh toán!');
      return;
    }

    const total = this.calculateSubtotal(activeCarts);
    const newOrder = {
      userId: user.id,
      items: activeCarts,
      total,
      status: 'Đang xử lý',
      ...data,
      isNew: true,
      createdAt: new Date().toISOString()
    };

    this.addOrder(newOrder);

    // Xóa các item đã checkout
    const deleteRequests = activeCarts.map(item =>
      this.http.delete(`http://localhost:3000/carts/${item.id}`)
    );
    forkJoin(deleteRequests).pipe(tap(() => this.cartService.loadCart())).subscribe();

    alert('Thanh toán thành công! Đơn hàng đã được tạo.');
  }

  /** Cập nhật trạng thái order */
  updateOrderStatus(orderId: string, status: string) {
    this.http.patch(`${this.apiUrl}/${orderId}`, { status })
      .pipe(tap(() => this.loadOrders()))
      .subscribe();
  }

  /** Xóa order */
  removeOrder(orderId: string) {
    this.http.delete(`${this.apiUrl}/${orderId}`)
      .pipe(tap(() => this.orders.update(items => items.filter(o => o.id !== orderId))))
      .subscribe();
  }

  /** Đánh dấu isNew = false cho orders user hiện tại */
  updateOrdersIsNew() {
    const user = this.currentUser();
    if (!user) return;

    const updates = this.orders()
      .filter(o => o.userId === user.id && o.isNew)
      .map(order => this.http.patch(`${this.apiUrl}/${order.id}`, { isNew: false }));

    if (updates.length === 0) return;

    forkJoin(updates).pipe(tap(() => this.loadOrders())).subscribe();
  }

  /** Tìm thông tin user (employee hoặc customer) */
  findCurrentUserInfo(userId: string) {
    return this.employeeService.getEmployees().find((e: Employees) => e.id === userId)
      || this.customerService.getCustomers().find((c: Customer) => c.id === userId);
  }
}
