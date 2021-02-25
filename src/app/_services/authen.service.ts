import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  readonly BaseURI = 'http://localhost:3000/';
  readonly RegisterURL = 'registers/save-user';
  readonly CallbackURL = 'registers/linecallback';

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) { }

  formModel = this.fb.group({
    Email: ['', [Validators.email, Validators.required]],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    PhoneNumber: ['', [Validators.required,Validators.minLength(10)]]
  });

  register() {
    var body = {
      email: this.formModel.value.Email,
      fullName: this.formModel.value.FirstName + " " + this.formModel.value.LastName,
      phoneNumber: this.formModel.value.PhoneNumber
    };
    console.log(body);
    return this.http.post(this.BaseURI + this.RegisterURL , body);
  }

  sendCallback(code, state) {
    let params = new HttpParams();
    params = params.append('code', code);
    params = params.append('state', state);
    console.log(params)
    return this.http.get(this.BaseURI + this.CallbackURL, {params: params}).subscribe(response => console.log(response));
  }
}
