
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,  // nếu đây là standalone component
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // phải là styleUrls
})
export class DashboardComponent {
   totalUsers = signal(0);
  totalRevenue = signal(0);
  totalOrders = signal(0);
  lowStock = signal(0);

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.getStats().subscribe(stats => {
      this.totalUsers.set(stats.totalUsers);
      this.totalRevenue.set(stats.totalRevenue);
      this.totalOrders.set(stats.totalOrders);
      this.lowStock.set(stats.lowStock);
    });
  }
}
