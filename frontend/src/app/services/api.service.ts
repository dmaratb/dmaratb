import { AddResponse, Tenant } from './../models/response.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../models/response.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = environment.baseURL;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
    observe: 'body' as 'body',
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(
        this.baseUrl + 'users/login',
        {
          username: username,
          password: password,
        },
        this.httpOptions
      )
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  logout() {
    return this.http
      .put<any>(this.baseUrl + 'users/logout', {}, this.httpOptions)
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  addTenant(added: Tenant) {
    return this.http
      .put<AddResponse>(this.baseUrl + 'tenants/', added, this.httpOptions)
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  listTenants() {
    return this.http
      .get<Tenant[]>(this.baseUrl + 'tenants/', this.httpOptions)
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  updateTenant(updated: Tenant) {
    return this.http
      .post<Tenant>(this.baseUrl + 'tenants/', updated, this.httpOptions)
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  deleteTenant(id: string) {
    return this.http
      .delete<any>(this.baseUrl + 'tenants/' + id, this.httpOptions)
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  handleError(error: any) {
    if (error.status == 401) {
      this.router.navigate(['/login']);
    } else {
      throw error;
    }
  }
}
