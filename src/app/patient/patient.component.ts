import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { MedicineList } from '../_models/medicine';
import { Patient } from '../_models/patient';
import { AuthenService } from '../_services/authen.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  patientName: string;
  patientAge: number;
  patientRN: string;
  patientAN: string;
  searchPatientName: string;
  submitted = false;
  nameTaken = false;

  onAddPatient(){
    this.submitted = true;
    this._service.addPatient(this.patientName , this.patientAge, this.patientRN, this.patientAN).subscribe(res => {
      if(res === 'success')
      {
        this.submitted = false;
        this.loadPatientList();
      }
      else
        this.nameTaken = true;
    }, error => console.log(error));
  }

  onDeletePatient(patientName){
    this._service.deletePatient(patientName).subscribe(res => {
      this.loadPatientList();
    }, error => console.log(error));
  }

  onSearchPatient(){
    console.log(this.searchPatientName);
    this.PatientList$ = this._service.getPatient(this.searchPatientName);
  }

  PatientList$!: Observable<Patient[]>
  constructor( private _service: AuthenService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadPatientList();
  }
  
  async loadPatientList() {
    this.PatientList$ = await this._service.getAllPatient();
  }

}