import { Component, OnInit, computed, inject,Signal  } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../services/checkout.service';
import { CustomerService } from '../services/customers.service';
import { EmployeeService } from '../services/employee.service';
import { Customer, Employees, USERS } from '../interface/model';
import { FormsModule } from '@angular/forms';
import { AppUser } from '../interface/model';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  // --- Inject Services ---
  private checkoutService = inject(CheckoutService);
  private customerService = inject(CustomerService);
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  // --- Signals ---
  currentUser = this.checkoutService.currentUser as Signal<AppUser | null>;

  userCarts = computed(() => {
    const user = this.currentUser();
    return user ? this.checkoutService.getActiveUserCarts() : [];
  });

  subtotal = computed(() =>
    this.checkoutService.calculateSubtotal(this.userCarts())
  );

  // --- Reactive Form ---
  formData = this.fb.group({
    fullname: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
  });

  // --- Lifecycle ---
  ngOnInit(): void {
    const user = this.currentUser();
    if (!user) return;

    const currentInfo = this.checkoutService.findCurrentUserInfo(user.id!);
    if (currentInfo) {
      this.formData.patchValue(currentInfo);
    }
  }

  // --- Xử lý thanh toán ---
  handleSubmit(): void {
    if (this.formData.invalid || this.userCarts().length === 0) {
      alert('Vui lòng kiểm tra lại thông tin và giỏ hàng.');
      this.formData.markAllAsTouched();
      return;
    }

    try {
      this.updateUserInfo();
      this.checkoutService.checkout();
      this.formData.reset(this.formData.value);
      
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.');
    }
  }

  // --- Cập nhật thông tin người dùng ---
 private updateUserInfo(): void {
  const user = this.currentUser();
  if (!user) return;

  const updatedInfo = this.formData.getRawValue();

  if (user.role === 'customer') {
    const updatedCustomer: Customer = {
      id: user.id!,
      username: (user as Customer).username,
      password: (user as Customer).password,
      fullname: updatedInfo.fullname ?? user.fullname,
      phone: updatedInfo.phone ?? user.phone,
      email: updatedInfo.email ?? user.email,
      address: updatedInfo.address ?? user.address,
      role: 'customer',
      islocked: (user as Customer).islocked ?? false,
    };
    this.customerService.updateCustomer(updatedCustomer);
  } else if (user.role === 'employee') {
    const updatedEmployee: Employees = {
      id: user.id!,
      image: (user as Employees).image ?? '/image/avatar.jpg',
      fullname: updatedInfo.fullname ?? user.fullname,
      phone: updatedInfo.phone ?? user.phone,
      email: updatedInfo.email ?? user.email,
      address: updatedInfo.address ?? user.address,
      role: 'employee',
    };
    this.employeeService.updateEmployee(updatedEmployee);
  }
}
}

