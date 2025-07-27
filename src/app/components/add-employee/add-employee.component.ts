import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  groups: string[] = [
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
  ];
  filteredGroups: string[] = [...this.groups];
  groupSearch: string = '';
  today: Date = new Date();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.employeeForm.get('group')?.valueChanges.subscribe(() => {
      this.filterGroups();
    });
  }

  filterGroups() {
    this.filteredGroups = this.groups.filter((group) =>
      group.toLowerCase().includes(this.groupSearch.toLowerCase())
    );
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.employeeService
        .addEmployee(this.employeeForm.value)
        .subscribe(() => {
          this.router.navigate(['/employees']);
        });
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
