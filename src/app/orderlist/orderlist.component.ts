import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CheckoutService } from '../services/checkout.service';
import { BookService } from '../services/book.service';
import { Book } from '../services/book';

@Component({
  selector: 'app-orderlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css']
})
export class OrderlistComponent {

  checkoutService = inject(CheckoutService);
  bookService = inject(BookService);

  // orders là signal lấy từ CheckoutService
  orders = this.checkoutService.orders;

  updateStatus(orderId: string, newStatus: string) {
    this.checkoutService.updateOrderStatus(orderId, newStatus);
  }

  deleteOrder(orderId: string) {
    if (confirm('Bạn có muốn xóa đơn hàng này không?')) {
      this.checkoutService.removeOrder(orderId);
    }
  }

  getUserInfo(userId: string) {
    return this.checkoutService.findCurrentUserInfo(userId);
  }

  // ✅ HÀM QUAN TRỌNG: LẤY TÊN SÁCH TỪ productId
  getBookTitle(bookId: string): string {
  const book = this.bookService
    .getBooks()
    .find((b: Book) => b.id === bookId);

  return book ? book.title : '❌ Không tìm thấy sách';
}

}
