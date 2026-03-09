import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customers.service';
import { Customer, EMPTY_CUSTOMER } from '../interface/model';


@Component({
  selector: 'app-customers',
  standalone: true, // ✅ đánh dấu là standalone
  imports: [CommonModule, FormsModule], // ✅ import module trực tiếp
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  customerService = inject(CustomerService);
  customers = this.customerService.customers; // signal

  newCustomer: Customer = { ...EMPTY_CUSTOMER };
  editingId = signal<string | null>(null);
  showPasswords = signal<{ [key: string]: boolean }>({});

  addCustomer() {
    const current = this.customers();
    if (current.some(c => c.username === this.newCustomer.username)) {
      alert('Username already exists'); 
      return;
    }
    if (current.some(c => c.email === this.newCustomer.email)) {
      alert('Email already exists'); 
      return;
    }
    const newId = current.length > 0 ? 'cus' + (current.length + 1) : 'cus1';
    this.customerService.addCustomer({ ...this.newCustomer, id: newId });
    this.newCustomer = { ...EMPTY_CUSTOMER };
  }

  editCustomer(id: string) { this.editingId.set(id); }
  cancelEdit() { this.editingId.set(null); }

  updateCustomer() {
    const customer = this.customers().find(c => c.id === this.editingId());
    if (customer) this.customerService.updateCustomer(customer);
    this.editingId.set(null);
  }

  deleteCustomer(id: string) { this.customerService.removeCustomer(id); }

  togglePasswordVisibility(id: string) {
    this.showPasswords.update(map => ({ ...map, [id]: !map[id] }));
  }
}
