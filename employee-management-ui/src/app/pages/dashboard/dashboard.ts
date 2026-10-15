import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employee';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard  implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
private authService = inject(AuthService);
  employees = signal<Employee[]>([]);
editingEmployeeId = signal<string | null>(null);

  ngOnInit(): void {
  this.loadEmployees();
}



  searchTerm = signal('');
  totalEmployees = computed(() => this.employees().length);
  activeEmployees = computed(() => this.employees().filter(employee => employee.active).length);
  inactiveEmployees = computed(() => this.employees().filter(employee => !employee.active).length);


  filteredEmployees = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    return this.employees().filter(employee =>
      `${employee.name} ${employee.email} ${employee.department} ${employee.role}`
        .toLowerCase()
        .includes(search)
    );
  });

  loadEmployees() {
  this.employeeService.getEmployees().subscribe({
    next: (response) => {
      this.employees.set(response.employees);
    },
    error: (error) => {
      console.error('Failed to load employees:', error);
    }
  });
}


  addFilter() {
    return this.employees.update(employee => 
      [
        ...employee,
        {
    id: 4,
    name: 'Neha Singh',
    email: 'neha@example.com',
    department: 'Engineering',
    role: 'Backend Developer',
    active: true
        }
      ]
    )
  }

  getDepartments(){
    return Array.from(new Set(this.employees().map(employee => employee.department)));
  }

  employeeForm = new FormGroup({
  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  }),
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  }),
  department: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  role: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  active: new FormControl(true, {
    nonNullable: true
  }),
  age: new FormControl(18, {
  nonNullable: true,
  validators: [Validators.required, Validators.min(18)]
}),
salary: new FormControl(0, {
  nonNullable: true,
  validators: [Validators.required, Validators.min(0)]
})
});




onSubmit() {
  if (this.employeeForm.invalid) {
    this.employeeForm.markAllAsTouched();
    return;
  }

  const formValue = this.employeeForm.getRawValue();

  const employeeData = {
    name: formValue.name.trim(),
    email: formValue.email.trim().toLowerCase(),
    department: formValue.department,
    role: formValue.role.trim(),
    active: formValue.active,
    age: formValue.age,
    salary: formValue.salary
  };

  const editingId = this.editingEmployeeId();

  const request$ = editingId
    ? this.employeeService.updateEmployee(editingId, employeeData)
    : this.employeeService.createEmployee(employeeData);

  request$.subscribe({
    next: (savedEmployee) => {
      if (editingId) {
        this.employees.update(current =>
          current.map(employee =>
            employee._id === editingId ? savedEmployee : employee
          )
        );
      } else {
        this.employees.update(current => [
          savedEmployee,
          ...current
        ]);
      }

      this.editingEmployeeId.set(null);

      this.employeeForm.reset({
        name: '',
        email: '',
        department: '',
        role: '',
        active: true,
        age: 18,
        salary: 0
      });
    },
    error: (error) => {
      console.error('Failed to save employee:', error);
      alert(
        error.status === 409
          ? 'An employee with this email already exists.'
          : 'Failed to save employee. Please try again.'
      );
    }
  });
}

editEmployee(employee: Employee) {
  if (!employee._id) {
    alert('Cannot edit: MongoDB employee ID is missing.');
    return;
  }

  this.editingEmployeeId.set(employee._id);

  this.employeeForm.patchValue({
    name: employee.name,
    email: employee.email,
    department: employee.department,
    role: employee.role,
    active: employee.active,
    age: employee.age ?? 18,
    salary: employee.salary ?? 0
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

deleteEmployee(employee: Employee) {
  if (!employee._id) {
    alert('Cannot delete: MongoDB employee ID is missing.');
    return;
  }

  if (!confirm(`Delete ${employee.name}?`)) {
    return;
  }

  this.employeeService.deleteEmployee(employee._id).subscribe({
   next: () => {
      // Reload employees from the backend after deletion
      this.loadEmployees();

      if (this.editingEmployeeId() === employee._id) {
        this.cancelEdit();
      }
    },
    error: (error) => {
      console.error('Failed to delete employee:', error);
      alert('Failed to delete employee. Please try again.');
    }
  });
}




cancelEdit() {
  this.editingEmployeeId.set(null);

  this.employeeForm.reset({
    name: '',
    email: '',
    department: '',
    role: '',
    active: true,
    age: 18,
    salary: 0
  });
}



onLogout() {
  this.authService.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}

}
