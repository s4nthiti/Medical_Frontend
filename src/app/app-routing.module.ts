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

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'callback', component: CallbackComponent},
  {path: 'backend',
    children: [
      {path: '', component: BackendComponent},
      {path: 'medicine', component: MedicineComponent, canActivate: [AuthGuard]},
      {path: 'record', component: RecordComponent, canActivate: [AuthGuard]},
      {path: 'home', component: BackendmenuComponent, canActivate: [AuthGuard]}
    ]
  }
  //{path: 'medicine', component: MedicineComponent, canActivate: [AuthGuard]},
  //{path: 'record', component: RecordComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
