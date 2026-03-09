import { Component, computed, signal } from '@angular/core';
import { Book } from '../services/book';
import { BookService } from '../services/book.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-ebook',
  templateUrl: './ebook.component.html',
  styleUrls: ['./ebook.component.css'],
})
export class EbookComponent {
  // danh sách ebooks hiển thị
  ebooks = computed(() => this.ebookService.allBooks());

  // form để tạo hoặc edit
  formEbook = signal<Book>(this.emptyEbook());

  // trạng thái edit hay add
  isEditMode = signal(false);

  constructor(private ebookService: BookService) {}

  // tạo form trống
  private emptyEbook(): Book {
    return {
      id: '',
      title: '',
      image: '',
      category: '',
      author: '',
      description: '',
      pages: 0,
      price: 0,
      discount: 0,
      stock: 0,
      publishDate: '',
      translator: ''
    };
  }

  // validate form trước khi submit
  private validateForm(): boolean {
    const f = this.formEbook();
    if (!f.title.trim()) {
      alert('Vui lòng nhập tiêu đề sách');
      return false;
    }
    if (f.pages <= 0 || isNaN(f.pages)) {
      alert('Số trang phải lớn hơn 0');
      return false;
    }
    if (f.price <= 0 || isNaN(f.price)) {
      alert('Giá phải lớn hơn 0');
      return false;
    }
    return true;
  }

  // submit form tạo mới hoặc update
  submitForm(): void {
    if (!this.validateForm()) return;

    if (this.isEditMode()) {
      // update ebook
      this.ebookService.update(this.formEbook().id, this.formEbook());
    } else {
      // tạo mới ebook
      this.formEbook.update(f => ({ ...f, id: Date.now().toString() }));
      this.ebookService.create({ ...this.formEbook() });
    }

    this.resetForm();
  }

  // sửa ebook
  editEbook(ebook: Book): void {
    this.isEditMode.set(true);
    this.formEbook.set({ ...ebook });
  }

  // xóa ebook
  deleteEbook(id: string): void {
    if (confirm('Bạn có chắc muốn xóa sách này?')) {
      this.ebookService.delete(id);
      this.resetForm();
    }
  }

  // reset form về trạng thái ban đầu
  resetForm(): void {
    this.isEditMode.set(false);
    this.formEbook.set(this.emptyEbook());
  }

  // khi chọn file ảnh
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formEbook.update(f => ({ ...f, image: reader.result as string }));
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // tìm kiếm ebook
  search(query: string) {
    this.ebookService.onSearch(query);
  }

  // lọc theo category
  filterCategory(category: string) {
    this.ebookService.filterByCategory(category);
  }
}
