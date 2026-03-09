import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../services/book.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searching: string = '';

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  /** Tổng số sản phẩm trong giỏ hàng */
  totalItems = computed(() => this.cartService.getUserCart().length);

  /** Số đơn hàng mới */
  orderNewCount = computed(() =>
    this.checkoutService.getUserOrders().filter(o => o.isNew).length
  );

  /** Click nút Thông báo */
  updateIsNew() {
    this.checkoutService.updateOrdersIsNew();
    this.router.navigate(['/orderuser']);
  }

  /** Tìm kiếm sách */
  onSearch() {
    this.bookService.onSearch(this.searching);
  }

  /** Đăng xuất */
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
