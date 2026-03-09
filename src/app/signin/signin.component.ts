import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  username = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  passwordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignin() {
    const success = this.authService.Signin(this.username, this.password);
    if (success) {
      const role = this.authService.getCurrentUserRole();
      console.log('ROLE:', role);
      if (role === 'customer') {
        this.router.navigate(['']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.error = 'Sai tài khoản hoặc mật khẩu';
    }
  }
}
