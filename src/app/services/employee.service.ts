import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees: Employee[] = [];
  private currentUser: string | null = null;

  constructor() {
    for (let i = 1; i <= 100; i++) {
      this.employees.push({
        username: `user${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`,
        birthDate: new Date(1990 + (i % 30), i % 12, i % 28),
        basicSalary: 5000000 + i * 100000,
        status: ['Active', 'Inactive', 'On Leave'][i % 3],
        group: [
          'Group A',
          'Group B',
          'Group C',
          'Group D',
          'Group E',
          'Group F',
          'Group G',
          'Group H',
          'Group I',
          'Group J',
        ][i % 10],
        description: new Date(),
      });
    }
  }

  login(username: string, password: string): Observable<boolean> {
    if (username === 'admin' && password === 'password') {
      this.currentUser = username;
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getEmployees(
    page: number,
    pageSize: number,
    sortField: string,
    sortOrder: string,
    searchQuery: { firstName?: string; email?: string }
  ): Observable<{ employees: Employee[]; total: number }> {
    let filteredEmployees = [...this.employees];

    // if (searchQuery.firstName?.trim()) {
    //   filteredEmployees = filteredEmployees.filter((emp) =>
    //     emp.firstName
    //       .toLowerCase()
    //       .includes(searchQuery.firstName.toLowerCase())
    //   );
    // }
    // if (searchQuery.email?.trim()) {
    //   filteredEmployees = filteredEmployees.filter((emp) =>
    //     emp.email.toLowerCase().includes(searchQuery.email.toLowerCase())
    //   );
    // }

    filteredEmployees.sort((a, b) => {
      const valA = a[sortField as keyof Employee];
      const valB = b[sortField as keyof Employee];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortOrder === 'asc'
        ? valA > valB
          ? 1
          : -1
        : valB > valA
        ? 1
        : -1;
    });

    const start = (page - 1) * pageSize;
    const paginatedEmployees = filteredEmployees.slice(start, start + pageSize);

    return of({
      employees: paginatedEmployees,
      total: filteredEmployees.length,
    });
  }

  addEmployee(employee: Employee): Observable<boolean> {
    this.employees.push(employee);
    return of(true);
  }

  getEmployeeByUsername(username: string): Observable<Employee | undefined> {
    return of(this.employees.find((emp) => emp.username === username));
  }
}
