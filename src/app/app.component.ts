import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
})
export class AppComponent {
  isLoggedIn: boolean = false;

  constructor(private employeeService: EmployeeService) {
    this.isLoggedIn = this.employeeService.isLoggedIn();
  }

  logout() {
    this.employeeService.logout();
    this.isLoggedIn = false;
  }
}
