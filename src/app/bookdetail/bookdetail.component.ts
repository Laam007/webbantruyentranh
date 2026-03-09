import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css']
})
export class BookDetailComponent {
  bookId = signal<string>('');
  quantity = signal(1);

  bookDetail = computed(() => {
    const id = this.bookId();
    return id ? this.ebookService.getBooks().find(b => b.id === id) || null : null;
  });

  constructor(
    private route: ActivatedRoute,
    private ebookService: BookService,
    private cartService: CartService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.bookId.set(id);
    });

    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  discountPrice(price?: number, discount?: number) {
    if (!price) return 0;
    if (!discount) return price;
    return price - price * (discount / 100);
  }

  increaseQuantity() { this.quantity.update(q => q + 1); }
  decreaseQuantity() { this.quantity.update(q => q > 1 ? q - 1 : 1); }

  addToCart() {
    const book = this.bookDetail();
    if (book) {
      this.cartService.addToCart(book, this.quantity());
      
    }
  }
}
