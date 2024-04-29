import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private HttpClient: HttpClient) { }

  signup(data: any) {
    return this.HttpClient.post(this.url +
      "/employee/signup", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
