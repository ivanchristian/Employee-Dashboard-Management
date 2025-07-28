import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './services/employee.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private subscription: Subscription | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize login state
    this.isLoggedIn = this.employeeService.isLoggedIn();
    // Subscribe to route changes to update isLoggedIn
    this.subscription = this.router.events.subscribe(() => {
      this.isLoggedIn = this.employeeService.isLoggedIn();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.employeeService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
