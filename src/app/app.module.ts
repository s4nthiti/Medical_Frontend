import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { CallbackComponent } from './callback/callback.component';
import { BackendComponent } from './backend/backend.component';
import { MedicineComponent } from './medicine/medicine.component';
import { RecordComponent } from './record/record.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BackendmenuComponent } from './backend/backendmenu/backendmenu.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './_alert/alert.component';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';
import { PatientComponent } from './patient/patient.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    RegisterComponent,
    CallbackComponent,
    BackendComponent,
    MedicineComponent,
    RecordComponent,
    BackendmenuComponent,
    LoginComponent,
    AlertComponent,
    PatientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxMaterialTimepickerModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
