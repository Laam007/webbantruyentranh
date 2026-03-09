import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../services/book';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  items = [
    { image: '/image/carousel1.jpg' },
    { image: '/image/carousel2.png' },
    { image: '/image/carousel3.jpg' },
    { image: '/image/carousel4.webp' }
  ];

  categories: any[] = [];
  selectedCategory: string = 'TẤT CẢ TRUYỆN';

  // Signals cho pagination
  currentPage = signal(1);
  pageSize = signal(4);

  // totalPages là computed signal
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.bookService.allBooks().length / this.pageSize()))
  );

  // pagedBooks trả về mảng sách cho trang hiện tại
  pagedBooks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.bookService.allBooks().slice(start, end);
  });

  constructor(public bookService: BookService) {}

  ngOnInit(): void {
    this.categories = this.bookService.getCategories();
  }

  // getter plain để template dùng cho binding (tránh lỗi type-checker)
  get currentPageValue(): number {
    return this.currentPage();
  }
  get totalPagesValue(): number {
    return this.totalPages();
  }

  // books dùng để hiển thị (đã phân trang)
  get books(): Book[] {
    return this.pagedBooks();
  }

  // tính giá sau giảm
  discountPrice(price: number, discount: number) {
    return price - (price * (discount / 100));
  }

  // chọn danh mục (reset trang về 1) -> gọi service để lọc
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage.set(1);
    this.bookService.filterByCategory(category); // 👉 gọi sang service
  }

  // tạo mảng pagination hiển thị (số hoặc '...')
  getPagination(): (number | string)[] {
    const pageNumbers: (number | string)[] = [];
    const total = this.totalPagesValue;
    const current = this.currentPageValue;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pageNumbers.push(i);
      return pageNumbers;
    }

    // lớn hơn 5 trang -> rút gọn
    if (current > 3) pageNumbers.push(1, '...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (current < total - 2) pageNumbers.push('...', total);

    return pageNumbers;
  }

  // set page (nhận number hoặc '...' bị ignore)
  setCurrentPage(page: number | string): void {
    if (typeof page === 'string') return; // '...' click bỏ qua
    const p = Math.max(1, Math.min(page, this.totalPagesValue));
    if (p !== this.currentPage()) this.currentPage.set(p);
  }
}
 