import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { LoginComponent } from './components/login/login.component';
import { inject } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      () => {
        const employeeService = inject(EmployeeService);
        const router = inject(Router);
        if (employeeService.isLoggedIn()) {
          router.navigate(['/employees']);
          return false;
        }
        return true;
      },
    ],
  },
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [
      () => {
        const employeeService = inject(EmployeeService);
        const router = inject(Router);
        if (!employeeService.isLoggedIn()) {
          router.navigate(['/login']);
          return false;
        }
        return true;
      },
    ],
  },
  {
    path: 'add-employee',
    component: AddEmployeeComponent,
    canActivate: [
      () => {
        const employeeService = inject(EmployeeService);
        const router = inject(Router);
        if (!employeeService.isLoggedIn()) {
          router.navigate(['/login']);
          return false;
        }
        return true;
      },
    ],
  },
  {
    path: 'employee/:username',
    component: EmployeeDetailComponent,
    canActivate: [
      () => {
        const employeeService = inject(EmployeeService);
        const router = inject(Router);
        if (!employeeService.isLoggedIn()) {
          router.navigate(['/login']);
          return false;
        }
        return true;
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
