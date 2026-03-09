import { Component, computed, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router'; // ✅ Thêm dòng này
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
   imports: [CommonModule, RouterModule], // ✅ Bắt buộc có RouterModule
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);

  // ✅ Lấy giỏ hàng của user hiện tại (theo signal)
  carts = computed(() => {
    const currentUser = this.authService.user();
    if (!currentUser) return [];
    return this.cartService.carts().filter(
      (item) => item.userId === currentUser.id
    );
  });

  // ✅ Tính tổng tiền của user hiện tại
  totalPrice = computed(() =>
    this.carts()
      .filter((item) => item.active)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // ✅ Kiểm tra tất cả đã chọn chưa
  allSelected = computed(
    () => this.carts().length > 0 && this.carts().every((item) => item.active)
  );

  increaseQuantity(item: any): void {
    this.cartService.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item, item.quantity - 1);
    }
  }

  removeItem(item: any): void {
    this.cartService.removeCart(item);
  }

  toggleBuy(item: any) {
    this.cartService.toggleActive(item);
  }

  toggleBuyAll(active: boolean) {
    this.cartService.toggleActiveAll(active);
  }

  onSelectAllChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleBuyAll(checked);
  }
}
