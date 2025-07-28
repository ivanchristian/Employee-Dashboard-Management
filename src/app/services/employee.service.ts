import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private currentUser: string | null = null;
  private employees: Employee[] = [
    {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      birthDate: '1990-01-01',
      basicSalary: 50000,
      status: 'Active',
      group: 'Engineering',
      description: 'Software Engineer',
    },
    {
      username: 'jane_smith',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      birthDate: '1985-03-15',
      basicSalary: 60000,
      status: 'Active',
      group: 'Marketing',
      description: 'Marketing Manager',
    },
    {
      username: 'bob_johnson',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      birthDate: '1992-07-22',
      basicSalary: 55000,
      status: 'Inactive',
      group: 'HR',
      description: 'HR Specialist',
    },
    {
      username: 'alice_brown',
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice.brown@example.com',
      birthDate: '1988-11-30',
      basicSalary: 70000,
      status: 'Active',
      group: 'Finance',
      description: 'Financial Analyst',
    },
    {
      username: 'tom_wilson',
      firstName: 'Tom',
      lastName: 'Wilson',
      email: 'tom.wilson@example.com',
      birthDate: '1995-04-10',
      basicSalary: 48000,
      status: 'Active',
      group: 'Engineering',
      description: 'Junior Developer',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = localStorage.getItem('currentUser');
    }
  }

  login(username: string, password: string): Observable<boolean> {
    if (username === 'admin' && password === 'password') {
      this.currentUser = username;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', username);
      }
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    this.currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getEmployees(searchQuery?: {
    firstName?: string;
    email?: string;
  }): Observable<Employee[]> {
    if (!searchQuery) {
      return of(this.employees);
    }
    const filteredEmployees = this.employees.filter(
      (employee) =>
        (searchQuery.firstName
          ? employee.firstName
              .toLowerCase()
              .includes(searchQuery.firstName.toLowerCase())
          : true) ||
        (searchQuery.email
          ? employee.email
              .toLowerCase()
              .includes(searchQuery.email.toLowerCase())
          : true)
    );
    return of(filteredEmployees);
  }

  addEmployee(employee: Employee): Observable<void> {
    this.employees.push(employee);
    return of();
  }

  getEmployeeByUsername(username: string): Observable<Employee | undefined> {
    return of(
      this.employees.find((employee) => employee.username === username)
    );
  }
}
