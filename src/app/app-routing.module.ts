import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { CallbackComponent } from './callback/callback.component';
import { BackendComponent } from './backend/backend.component';
import { MedicineComponent } from './medicine/medicine.component';
import { AuthGuard } from './_helpers/auth.guard';
import { RecordComponent } from './record/record.component';
import { BackendmenuComponent } from './backend/backendmenu/backendmenu.component';
import { LoginComponent } from './login/login.component';
import { GuestGuard } from './_helpers/guest.guard';
import { Role } from './_models/role';
import { PatientComponent } from './patient/patient.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
  {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  {path: 'callback', component: CallbackComponent},
  {path: 'backend', canActivate: [AuthGuard], data: { roles: [Role.Admin] },
    children: [
      {path: '', component: BackendmenuComponent},
      {path: 'medicine', component: MedicineComponent},
      {path: 'record', component: RecordComponent},
      {path: 'home', component: BackendmenuComponent},
      {path: 'patient', component: PatientComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
