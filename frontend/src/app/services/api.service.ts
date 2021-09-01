import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Tenant } from '../models/tenant.model';
import { User } from './../models/user.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
    observe: 'body' as 'body',
  };
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient, private router: Router) {}

  login(user: User) {
    return this.http
      .post<User>(this.baseUrl + 'users/login', user, this.httpOptions)
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  logout() {
    return this.http
      .post(this.baseUrl + 'users/logout', {}, this.httpOptions)
      .toPromise()
      .catch((error) => this.handleError(error));
  }

  addTenant(added: Tenant) {
    return this.http
      .put<Tenant>(this.baseUrl + 'tenants/', added, this.httpOptions)
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
      .delete<Tenant>(this.baseUrl + 'tenants/' + id, this.httpOptions)
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
