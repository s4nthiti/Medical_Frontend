import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineList } from '../_models/medicine';
import { Bed } from '../_models/bed';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Patient } from '../_models/patient';
import { Record } from '../_models/record';
import { User } from '../_models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertService } from '../_alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  readonly AdminUsername = 'rightdoc_backend';
  readonly AdminPassword = 'admin';

  readonly BaseURI = 'http://rightdoc.ddns.net:25565/';
  readonly RegisterURL = 'account/register';
  readonly LoginURL = 'account/login';
  readonly AccountURL = 'account/';
  readonly CallbackURL = 'account/linecallback';
  readonly MedicineURL = 'medicines/';
  readonly RecordURL = 'records/';
  readonly PatientURL = 'patients/';

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router, private jwtHelper: JwtHelperService, private alertService: AlertService) { }

  formModel = this.fb.group({
    PhoneNumber: ['', [Validators.required,Validators.minLength(10)]],
    Password: ['', [Validators.required,Validators.minLength(4)]],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required]
  });

  loginModel = this.fb.group({
    PhoneNumber: ['', [Validators.required,Validators.minLength(10)]],
    Password: ['', Validators.required]
  });

  recordModel = this.fb.group({
    bedNo: ['',[Validators.required]],
    ward: ['',[Validators.required]],
    patientName: ['',[Validators.required]],
    age: ['',[Validators.required]],
    rn: ['',[Validators.required]],
    an: ['',[Validators.required]],
    medication: ['',[Validators.required]],
    hour: ['',[Validators.required]]
  })

  medicationModel = this.fb.group({
    bedNo: ['',[Validators.required]],
    patientName: ['',[Validators.required]],
    medication: ['',[Validators.required]],
    hour: ['',[Validators.required]]
  })

  register() {
    var body = {
      phonenumber: this.formModel.value.PhoneNumber,
      password: this.formModel.value.Password,
      name: this.formModel.value.FirstName + " " + this.formModel.value.LastName
    };
    console.log(body);
    return this.http.post(this.BaseURI + this.RegisterURL , body);
  }

  sendCallback(code, state) {
    let params = new HttpParams();
    params = params.append('code', code);
    params = params.append('state', state);
    return this.http.get(this.BaseURI + this.CallbackURL, {params: params}).subscribe(response => console.log(response));
  }

  login() {
    var body = {
      phonenumber: this.loginModel.value.PhoneNumber,
      password: this.loginModel.value.Password
    };
    return this.http.post(this.BaseURI + this.LoginURL, body, { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

   isAuthenticated(): boolean {
    if(localStorage.getItem('token') == null)
      return false;
    if(this.isTokenExpired())
    {
      this.logout();
      return false;
    }
      return true;
    }

    logout() {
      if(localStorage.getItem('token') != null)
      {
        if(!this.isTokenExpired())
          this.alertService.success('Logout successful', { autoClose: true, keepAfterRouteChange: true });
        localStorage.removeItem('token');
      }
      this.router.navigate(['']);
    }

    isTokenExpired(): boolean {
      const getToken = localStorage.getItem('token');
      const token = JSON.stringify(getToken);
      return this.jwtHelper.isTokenExpired(token);
    }

   getAllMedicine(): Observable<MedicineList[]> {
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
     return this.http.get<MedicineList[]>(this.BaseURI + this.MedicineURL + 'getAll', { headers: tokenHeader })
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
   }

   getMedicine(name): Observable<MedicineList[]> {
    var body = {medicineName: name};
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.post<MedicineList[]>(this.BaseURI + this.MedicineURL + 'get', body, { headers: tokenHeader });
   }

   addMedicine(name){
      var body = {medicineName: name};
      var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
      return this.http.post(this.BaseURI + this.MedicineURL + 'add', body, { headers: tokenHeader });
   }

   deleteMedicine(name){
    var body = {medicineName: name};
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.post(this.BaseURI + this.MedicineURL + 'delete', body, { headers: tokenHeader });
   }

   errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getPatientByBed(roomNo){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.PatientURL + 'bed/' + roomNo, { headers: tokenHeader });
  }

  removePatientfromBed(roomNo){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.PatientURL + 'remove/' + roomNo, { headers: tokenHeader });
  }

  addPatienttoBed(roomNo, name){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.PatientURL + 'addBed/' + name + '&' + roomNo, { headers: tokenHeader });
  }

  addRecordTime(roomNo, medicationName, startdate, enddate, time, nurseName){
    var body = {
      bedNo: roomNo,
      startdate: startdate,
      enddate: enddate,
      medicationName: medicationName,
      time: time,
      nurseName: nurseName
    };
    console.log(body);
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.post(this.BaseURI + this.RecordURL + 'add', body, { headers: tokenHeader });
  }

  getRecord(bedNo): Observable<Record[]>{
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get<Record[]>(this.BaseURI + this.RecordURL + bedNo, { headers: tokenHeader });
  }

  deleteRecord(_id){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.RecordURL + 'delete/' + _id, { headers: tokenHeader });
  }

  getAllNurse(){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.AccountURL + 'getAll/', { headers: tokenHeader });
  }

  toggleNotify(toggle){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.AccountURL + 'notify=' + toggle,{ headers: tokenHeader });
  }

  getNotify(){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.AccountURL + 'notify',{ headers: tokenHeader });
  }

  addPatient(name,age,rn,an){
    var body = {
      name: name,
      age: age,
      rn: rn,
      an: an
    };
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.post(this.BaseURI + this.PatientURL + 'add', body, { headers: tokenHeader });
  }

  deletePatient(name){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.post(this.BaseURI + this.PatientURL + 'delete/' + name, { headers: tokenHeader });
  }

  getPatient(name): Observable<Patient[]> {
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get<Patient[]>(this.BaseURI + this.PatientURL + `${name}`, { headers: tokenHeader });
   }

   getAllPatient(): Observable<Patient[]>{
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get<Patient[]>(this.BaseURI + this.PatientURL, { headers: tokenHeader });
  }

  checkNotiUser() {
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.AccountURL + 'noti', { headers: tokenHeader });
  }
}
