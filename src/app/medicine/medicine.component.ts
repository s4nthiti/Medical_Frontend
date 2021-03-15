import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MedicineList } from '../_models/medicine';
import { AuthenService } from '../_services/authen.service';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss']
})
export class MedicineComponent implements OnInit {

  medicineName: string;
  searchMedicineName: string;
  submitted = false;
  medicineTaken = false;

  onAddMedicine(){
    this.submitted = true;
    this._service.addMedicine(this.medicineName).subscribe(res => {
      if(res === 'success')
      {
        this.submitted = false;
        this.loadMedicineList();
      }
      else
        this.medicineTaken = true;
    }, error => console.log(error));
  }

  onDeleteMedicine(medicineName){
    this._service.deleteMedicine(medicineName).subscribe(res => {
      this.loadMedicineList();
    }, error => console.log(error));
  }

  onSearchMedicine(){
    console.log(this.searchMedicineName);
    this.MedicineList$ = this._service.getMedicine(this.searchMedicineName);
  }

  MedicineList$!: Observable<MedicineList[]>
  constructor( private _service: AuthenService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadMedicineList();
  }
  
  async loadMedicineList() {
    this.MedicineList$ = await this._service.getAllMedicine();
  }

}