import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  signup(data: any) {
    return this.httpClient.post(this.url +
      "/employee/signup", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  forgotPassword(data: any) {
    return this.httpClient.post(this.url +
      "/employee/forgotPassword/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  login(data:any){
    return this.httpClient.post(this.url +
      "/employee/login/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  checkToken(){
    return this.httpClient.get(this.url + "/employee/checkToken/");
  }

  changePassword(data:any){
    return this.httpClient.post(this.url +
      "/employee/changePassword", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }
}
