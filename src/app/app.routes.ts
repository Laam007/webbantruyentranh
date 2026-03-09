// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookDetailComponent } from './bookdetail/bookdetail.component';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EbookComponent } from './ebook/ebook.component';
import { SigninComponent } from './signin/signin.component';
import { authGuard } from './auth/auth.guard';
import { EmployeesComponent } from './employees/employees.component';

import { CustomersComponent } from './customers/customers.component';
import { SignupComponent } from './signup/signup.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { OrderUserComponent } from './orderuser/orderuser.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'book/:id', component: BookDetailComponent, title: 'Chi tiết sách' },
  { path: 'cart', component: CartComponent, title: 'Giỏ hàng' },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },
  { path: 'signup', component: SignupComponent, title: 'Sign up' },
  { path: 'checkout', component: CheckoutComponent, title: 'Check out' },
  { path: 'orderuser', component: OrderUserComponent, title: 'Đơn hàng của bạn' },

 

 

  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [authGuard],
    children: [
      { path: 'employees', component: EmployeesComponent, title: 'Employees' },
      { path: 'customers', component: CustomersComponent, title: 'Customers' },
      { path: 'ebook', component: EbookComponent, title: 'Ebook' },
      { path: 'orderlist', component: OrderlistComponent, title: 'Orderlist' },
    ], 
  },


];
