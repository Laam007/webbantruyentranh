import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { forkJoin, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/carts';
  carts = signal<any[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCart();
  }

  /** Load toàn bộ giỏ hàng của user hiện tại từ API */
  loadCart() {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.carts.set([]);
      return;
    }

    this.http
      .get<any[]>(`${this.apiUrl}?userId=${currentUser.id}`)
      .subscribe((data) => this.carts.set(data));
  }

  /** Lấy giỏ hàng user hiện tại */
  getUserCart() {
    return this.carts();
  }

  /** Thêm sản phẩm vào giỏ hàng */
addToCart(product: any, quantity: number) {
  const currentUser = this.authService.user();
  if (!currentUser) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
    return;
  }

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  this.http
    .get<any[]>(`${this.apiUrl}?productId=${product.id}&userId=${currentUser.id}`)
    .pipe(
      switchMap((res) => {
        const existing = res[0];
        if (existing) {
          // Cập nhật số lượng
          return this.http.patch(`${this.apiUrl}/${existing.id}`, { quantity: existing.quantity + quantity })
            .pipe(
              tap(() => {
                // Cập nhật signal ngay
                this.carts.update(items =>
                  items.map(item =>
                    item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
                  )
                );
              })
            );
        } else {
          // Thêm mới
          const newItem = {
            userId: currentUser.id,
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity,
            image: product.image,
            discount: product.discount,
            active: false,
          };
          return this.http.post(this.apiUrl, newItem)
            .pipe(
              tap((res: any) => {
                // Push trực tiếp vào signal
                this.carts.update(items => [...items, res]);
              })
            );
        }
      })
    )
    .subscribe(() => alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`));
}

  /** Cập nhật số lượng */
  updateQuantity(item: any, quantity: number) {
    const currentUser = this.authService.user();
    if (!currentUser) return;

    this.http
      .get<any[]>(`${this.apiUrl}?userId=${currentUser.id}&productId=${item.productId}`)
      .pipe(
        switchMap((items) => {
          if (!items.length) return of(null);
          return this.http.patch(`${this.apiUrl}/${items[0].id}`, { quantity });
        }),
        tap(() => this.loadCart())
      )
      .subscribe();
  }

  /** Xóa sản phẩm */
  removeCart(item: any) {
    const currentUser = this.authService.user();
    if (!currentUser) return;

    this.http
      .get<any[]>(`${this.apiUrl}?userId=${currentUser.id}&productId=${item.productId}`)
      .pipe(
        switchMap((items) => {
          if (!items.length) return of(null);
          return this.http.delete(`${this.apiUrl}/${items[0].id}`);
        }),
        tap(() => this.loadCart())
      )
      .subscribe();
  }

  /** Chọn/bỏ chọn 1 sản phẩm */
  toggleActive(item: any) {
    const currentUser = this.authService.user();
    if (!currentUser) return;

    this.http
      .get<any[]>(`${this.apiUrl}?userId=${currentUser.id}&productId=${item.productId}`)
      .pipe(
        switchMap((items) => {
          if (!items.length) return of(null);
          return this.http.patch(`${this.apiUrl}/${items[0].id}`, {
            active: !items[0].active,
          });
        }),
        tap(() => this.loadCart())
      )
      .subscribe();
  }

  /** Chọn/bỏ chọn tất cả */
  toggleActiveAll(active: boolean) {
    const requests = this.carts().map((item) =>
      this.http.patch(`${this.apiUrl}/${item.id}`, { active })
    );
    forkJoin(requests).pipe(tap(() => this.loadCart())).subscribe();
  }

  /** Xóa toàn bộ giỏ hàng user hiện tại */
  clearCart() {
    const requests = this.carts().map((item) =>
      this.http.delete(`${this.apiUrl}/${item.id}`)
    );
    forkJoin(requests).pipe(tap(() => this.loadCart())).subscribe();
  }
}
