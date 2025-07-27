import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.employeeService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
