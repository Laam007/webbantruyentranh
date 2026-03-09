import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';


import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';


// import { HomeComponent } from './home/home.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lab8';
  constructor (private router: Router){}
   isDashboardPage(): boolean {
return this.router.url.includes('/dashboard');
}
}
