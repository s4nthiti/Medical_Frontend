import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Bed } from '../_models/bed';
import { MedicineList } from '../_models/medicine';
import { AuthenService } from '../_services/authen.service';
import { Record } from '../_models/record';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  constructor(private _service: AuthenService) { }

  inRoom = false;
  roomNo = 0;
  emptyRoom = true;

  patientName$!: Observable<Bed[]>
  currentPatient: any;
  patientName: any;

  medicination: string;

  medicationName : any = "";
  MedicineList$!: Observable<MedicineList[]>
  nurseName: any;
  NurseList$!: any;
  timeList: Observable<Date[]>

  medicationTaken = false;
  medicSelected = false;
  dateSelected = false;
  timeSelected = false;
  nurseSelected = false;

  time: any;

  myControl = new FormControl();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  onClickRoom(room){
    this.inRoom = true;
    this.roomNo = room;
    this.loadBed();
  }

  backToSelect(){
    this.inRoom = false;
    this.roomNo = 0;
    this.medicSelected = false;
    this.dateSelected = false;
    this.timeSelected = false;
    this.range.setValue({
      start: null,
      end: null
    });
    this.time = null;
  }

  async checkRoomEmpty(){
    this._service.getPatientByBed(this.roomNo).subscribe(res => {

      if(res == 'none')
      {
        this.emptyRoom = true;
      }
      else
      {
        this.emptyRoom = false;
        this.currentPatient = res;
        this.loadMedicineList();
        this.loadRecordList();
      }
    }, err => {
      this.emptyRoom = true;
    });
  }

  async loadBed() {
    this.patientName$ = await this._service.getAllPatient();
    this.checkRoomEmpty();
  }

  async loadMedicineList() {
    this.MedicineList$ = await this._service.getAllMedicine();
  }

  onSelectMedic() {
    if(this.medicationName == 'None')
      this.medicSelected = false;
    else
      this.medicSelected = true;
  }

  onSelectNurse() {
    if(this.nurseName == 'None')
      this.nurseSelected = false;
    else
      this.nurseSelected = true;
  }

  onSelectDate() {
    if(this.range.get('start').value != null && this.range.get('end').value != null)
      this.dateSelected = true;
    else
      this.dateSelected = false;
  }

  onSelectTime() {
    if(this.time != null)
    {
      this.timeSelected = true;
      this.loadNurseList();
    }
    else
      this.timeSelected = false;
  }

  async loadNurseList() {
    this.NurseList$ = await this._service.getAllNurse();
  }

  addPatientBed() {
    console.log(this.patientName);
    this._service.addPatienttoBed(this.roomNo, this.patientName).subscribe(res => {
      if(res == 'success')
      {
        this.loadBed();
      }
    }, err => {
      this.emptyRoom = true;
    });
  }

  removePatientBed() {
    this._service.removePatientfromBed(this.roomNo).subscribe(res => {
      if(res == 'success')
      {
        this.emptyRoom = true;
        this.currentPatient = null;
      }
    }, err => {
      this.emptyRoom = false;
    });
  }

  addRecordTime() {
    console.log("Medication = " + this.medicationName);
    console.log("Date = " + this.range.get('start').value + " - " + this.range.get('end').value);
    console.log("Time = " + this.time);
    var a = this.time.split(':');
    var timeInt = (parseInt(a[0]) * 60) + parseInt(a[1]);
    console.log(timeInt);
    this._service.addRecordTime(this.roomNo, this.medicationName, this.range.get('start').value, this.range.get('end').value, timeInt, this.nurseName).subscribe(res => {
      if(res == 'success'){
        this.loadRecordList();
      }
    }, err => {console.log(err);}
    )

  }

  RecordList$!: Observable<Record[]>

  ngOnInit(): void {
  }
  
  async loadRecordList() {
    this.RecordList$ = await this._service.getRecord(this.roomNo);
  }

  time_convert(num)
  { 
    var hours = Math.floor(num / 60);  
    var minutes = num % 60;
    var hoursStr;
    var minutesStr;
    if(hours < 10)
      hoursStr = '0' + hours;
    else
      hoursStr = hours;
    if(minutes < 10)
      minutesStr = '0' + minutes;
    else
      minutesStr = minutes;
    return `${hoursStr}:${minutesStr}`;         
  }

  onDeleteRecord(_id){
    console.log(_id);
    this._service.deleteRecord(_id).subscribe(res => {
      if(res == 'success'){
        this.loadRecordList();
      }
    }, err => {console.log(err);
    })
  }

}
