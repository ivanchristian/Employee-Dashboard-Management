import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
  ],
  animations: [
    trigger('rowHover', [
      state(
        'inactive',
        style({ transform: 'scale(1)', backgroundColor: 'transparent' })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.02)',
          backgroundColor: 'rgba(63, 81, 181, 0.05)',
        })
      ),
      transition('inactive <=> active', animate('200ms ease-in-out')),
    ]),
  ],
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'username',
    'firstName',
    'lastName',
    'email',
    'actions',
  ];
  employees: MatTableDataSource<Employee> = new MatTableDataSource<Employee>(
    []
  );
  totalEmployees: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  searchQuery: { firstName?: string; email?: string } = {};

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.employees.sort = this.sort;
    this.employees.paginator = this.paginator;
  }

  loadEmployees() {
    this.employeeService.getEmployees(this.searchQuery).subscribe((data) => {
      this.employees.data = data;
      this.totalEmployees = data.length; // Update based on actual data
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  onPageSizeChange() {
    this.pageIndex = 0;
    this.loadEmployees();
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      const sortedData = [...this.employees.data].sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        const field = sort.active as keyof Employee;
        return (a[field] < b[field] ? -1 : 1) * (isAsc ? 1 : -1);
      });
      this.employees.data = sortedData;
    }
  }

  search() {
    this.pageIndex = 0;
    this.loadEmployees();
  }

  navigateToAddEmployee() {
    this.router.navigate(['/add-employee']);
  }

  editEmployee(username: string) {
    this.snackBar.open(`Viewing ${username}`, 'Close', {
      duration: 3000,
      panelClass: ['bg-warning'],
    });
    this.router.navigate(['/employee', username]);
  }

  deleteEmployee(username: string) {
    this.snackBar.open(`Deleting ${username}`, 'Close', {
      duration: 3000,
      panelClass: ['bg-danger', 'text-white'],
    });
  }
}
