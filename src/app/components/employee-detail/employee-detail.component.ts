import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate(
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('buttonHover', [
      state('inactive', style({ transform: 'scale(1)' })),
      state('active', style({ transform: 'scale(1.05)' })),
      transition('inactive <=> active', animate('200ms ease-in-out')),
    ]),
  ],
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  buttonState: string = 'inactive';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.employeeService.getEmployeeByUsername(username).subscribe({
        next: (employee) => {
          this.employee = employee || null;
        },
        error: () => {
          this.employee = null;
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}
