import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineList } from '../_models/medicine';
import { Bed } from '../_models/bed';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Patient } from '../_models/patient';
import { Record } from '../_models/record';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  readonly AdminUsername = 'rightdoc_backend';
  readonly AdminPassword = 'admin';

  readonly BaseURI = 'http://34.126.120.13:3000/';
  readonly RegisterURL = 'registers/save-user';
  readonly CallbackURL = 'registers/linecallback';
  readonly MedicineURL = 'medicines/';
  readonly RecordURL = 'records/';
  readonly PatientURL = 'patients/';

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) { }

  formModel = this.fb.group({
    Email: ['', [Validators.email, Validators.required]],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    PhoneNumber: ['', [Validators.required,Validators.minLength(10)]]
  });

  loginModel = this.fb.group({
    Username: ['', Validators.required],
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

  login() {
    if(this.loginModel.value.Username === this.AdminUsername && this.loginModel.value.Password === this.AdminPassword)
    {
      localStorage.setItem('superAccess', 'true');
      return true;
    }
    else
      return false;

   }

   isAuthenticated() {
    let key = localStorage.getItem('superAccess');
    if(key === 'true')
      return true;
    else
      return false;
   }

   getAllMedicine(): Observable<MedicineList[]> {
     return this.http.get<MedicineList[]>(this.BaseURI + this.MedicineURL + 'getAll')
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
   }

   getMedicine(name): Observable<MedicineList[]> {
    var body = {medicineName: name};
    return this.http.post<MedicineList[]>(this.BaseURI + this.MedicineURL + 'get', body);
   }

   addMedicine(name){
      var body = {medicineName: name};
      return this.http.post(this.BaseURI + this.MedicineURL + 'add', body);
   }

   deleteMedicine(name){
    var body = {medicineName: name};
    return this.http.post(this.BaseURI + this.MedicineURL + 'delete', body);
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

  getAllPatient(): Observable<Bed[]>{
    return this.http.get<Bed[]>(this.BaseURI + this.PatientURL);
  }

  getPatientByBed(roomNo){
    return this.http.get(this.BaseURI + this.PatientURL + 'bed/' + roomNo);
  }

  removePatientfromBed(roomNo){
    return this.http.get(this.BaseURI + this.PatientURL + 'remove/' + roomNo);
  }

  addPatienttoBed(roomNo, name){
    return this.http.get(this.BaseURI + this.PatientURL + 'addBed/' + name + '&' + roomNo);
  }

  addRecordTime(roomNo, medicationName, startdate, enddate, time){
    var body = {
      bedNo: roomNo,
      startdate: startdate,
      enddate: enddate,
      medicationName: medicationName,
      time: time
    };
    console.log(body);
    return this.http.post(this.BaseURI + this.RecordURL + 'add', body);
  }

  getRecord(bedNo): Observable<Record[]>{
    return this.http.get<Record[]>(this.BaseURI + this.RecordURL + bedNo);
  }

  deleteRecord(_id){
    return this.http.get(this.BaseURI + this.RecordURL + 'delete/' + _id);
  }

}
