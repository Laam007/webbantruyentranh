import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  // 🟢 Dữ liệu gốc từ API
  private allBooksSource = signal<Book[]>([]);

  // 🟢 Dữ liệu hiển thị (sau khi lọc / tìm kiếm)
  public allBooks = signal<Book[]>([]);

  // 🟢 Danh mục tĩnh (kèm icon)
  private categories = [
    { name: 'TẤT CẢ TRUYỆN', icon: '' },
    { name: 'Doraemon', icon: '/image/danhmuc1.jpg' },
    { name: 'Naruto', icon: '/image/danhmuc2.jpg' },
    { name: 'Onepiece', icon: '/image/danhmuc3.jpg' },
    { name: 'Dragon Ball', icon: '/image/danhmuc4.jpg' },
  ];

  constructor(private http: HttpClient) {
    this.loadBooks();
  }

  // 🟢 Tải dữ liệu từ API
  loadBooks(): void {
    this.http.get<Book[]>(this.apiUrl).subscribe(data => {
      this.allBooksSource.set(data);
      this.allBooks.set(data);
    });
  }

  // 🟢 Lấy tất cả sách
  getBooks(): Book[] {
    return this.allBooks();
  }

  // 🟢 Lấy 1 sách theo ID
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  // 🟢 Thêm sách
  create(book: Book): void {
    this.http.post<Book>(this.apiUrl, book).subscribe(newBook => {
      this.allBooksSource.update(list => [...list, newBook]);
      this.allBooks.update(list => [...list, newBook]);
    });
  }

  // 🟢 Cập nhật sách
  update(id: string, book: Book): void {
    this.http.put<Book>(`${this.apiUrl}/${id}`, book).subscribe(updated => {
      this.allBooksSource.update(list => list.map(b => b.id === id ? updated : b));
      this.allBooks.update(list => list.map(b => b.id === id ? updated : b));
    });
  }

  // 🟢 Xóa sách
  delete(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(() => {
      this.allBooksSource.update(list => list.filter(b => b.id !== id));
      this.allBooks.update(list => list.filter(b => b.id !== id));
    });
  }

  // 🟢 Tìm kiếm
  onSearch(query: string): void {
    const lower = (query || '').toLowerCase().trim();
    const source = this.allBooksSource();
    if (!lower) {
      this.allBooks.set(source);
    } else {
      this.allBooks.set(
        source.filter(b =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower) ||
          b.category.toLowerCase().includes(lower)
        )
      );
    }
  }

  // 🟢 Lọc theo danh mục
  filterByCategory(category: string): void {
    const source = this.allBooksSource();
    if (category === 'TẤT CẢ TRUYỆN') {
      this.allBooks.set(source);
    } else {
      this.allBooks.set(source.filter(b => b.category === category));
    }
  }

  // 🟢 Lấy danh mục có icon (cho giao diện)
  getCategories() {
    return this.categories;
  }
}
