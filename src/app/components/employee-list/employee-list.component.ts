import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
    FormsModule,
  ],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
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
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Initialize table
    this.loadEmployees();
    this.employees.sort = this.sort;
    this.employees.paginator = this.paginator;

    // Set up custom filter predicate
    this.employees.filterPredicate = (data: Employee, filter: string) => {
      const searchStr = filter.toLowerCase().trim();
      return (
        data.username?.toLowerCase().includes(searchStr) ||
        false ||
        data.firstName?.toLowerCase().includes(searchStr) ||
        false ||
        data.lastName?.toLowerCase().includes(searchStr) ||
        false ||
        data.email?.toLowerCase().includes(searchStr) ||
        false
      );
    };

    // Set up search debouncing
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.employees.filter = term.trim().toLowerCase();
        this.totalEmployees = this.employees.filteredData.length;
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.firstPage();
        }
      });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees.data = data;
      this.totalEmployees = data.length;
      // Apply filter if search term exists
      if (this.searchTerm) {
        this.employees.filter = this.searchTerm.trim().toLowerCase();
        this.totalEmployees = this.employees.filteredData.length;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      const sortedData = [...this.employees.data].sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        const field = sort.active as keyof Employee;
        const aValue = a[field] ?? '';
        const bValue = b[field] ?? '';
        return (aValue < bValue ? -1 : 1) * (isAsc ? 1 : -1);
      });
      this.employees.data = sortedData;
    }
  }

  search() {
    this.searchSubject.next(this.searchTerm);
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
