export interface LoginResponse {
  name: string;
}

export interface AddResponse {
  id: string;
}

export interface User {
  id: string;
  name: string;
  password: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  address: string;
  debt: number;
}
