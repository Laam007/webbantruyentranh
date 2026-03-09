import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../interface/model';
import { CustomerService } from '../services/customers.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule // ✅ Thêm dòng này để dùng [routerLink]
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  customers = signal<Customer[]>([]);
  submitted = false;
  errorMessages: any = {};

  signUpForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', [Validators.required])
  });

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customers.set(this.customerService.getCustomers());
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessages = {};

    const form = this.signUpForm.value;

    if (this.signUpForm.invalid) return;

    if (form.password !== form.confirmPassword) {
      this.errorMessages.confirmPassword = 'Mật khẩu xác nhận không khớp.';
      return;
    }

    if (this.customers().some(c => c.username === form.username)) {
      this.errorMessages.username = 'Tên đăng nhập đã tồn tại.';
      return;
    }

    const newCustomer: Customer = {
      id: 'cus' + (this.customers().length + 1),
      username: form.username!,
      password: form.password!,
      fullname: '',
      phone: '',
      email: '',
      address: '',
      role: 'customer',
      islocked: false
    };

    this.customerService.addCustomer(newCustomer);
    this.customers.set(this.customerService.getCustomers());
    this.router.navigate(['/signin']);
  }

  get f() {
    return this.signUpForm.controls;
  }
}
