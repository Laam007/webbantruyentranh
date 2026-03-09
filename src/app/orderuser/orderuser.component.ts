import { Component, inject, computed, OnInit } from '@angular/core';
import { CheckoutService } from '../services/checkout.service';
import { BookService } from '../services/book.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orderuser',
  templateUrl: './orderuser.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OrderUserComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  bookService = inject(BookService);

  orders = computed(() => this.checkoutService.getUserOrders());

  // ✅ cache tên sản phẩm
  productNames: { [productId: string]: string } = {};

  ngOnInit() {
  this.orders().forEach(order => {
    order.items?.forEach((item: {
      productId: string;
      quantity: number;
      price: number;
    }) => {
      if (!this.productNames[item.productId]) {
        this.bookService.getBookById(item.productId).subscribe(book => {
          this.productNames[item.productId] = book?.title || 'Sản phẩm';
        });
      }
    });
  });
}

  updateStatus(orderId: string, newStatus: string) {
    this.checkoutService.updateOrderStatus(orderId, newStatus);
  }

  getUserInfo(userId: string) {
    return this.checkoutService.findCurrentUserInfo(userId);
  }
}
