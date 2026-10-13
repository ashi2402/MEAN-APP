
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface EmployeeResponse {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
  employees: Employee[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Employee {
  id?: number;
  _id?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  active: boolean;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  department: string;
  role: string;
  active: boolean;
  age: number;
  salary: number;
}

export interface Employee {
  id?: number;
  _id?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  active: boolean;
  age?: number;
  salary?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);

  private apiUrl = 'https://mean-employee-api.onrender.com/api/employees';

  getEmployees() {
    return this.http.get<EmployeeResponse>(this.apiUrl);
  }

  createEmployee(employee: CreateEmployeeRequest) {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

updateEmployee(id: string, employee: Partial<Employee>) {
  return this.http.put<Employee>(
    `${this.apiUrl}/${id}`,
    employee
  );
}

deleteEmployee(id: string) {
  return this.http.delete<{ message: string; employee: Employee }>(
    `${this.apiUrl}/${id}`
  );
}
}
