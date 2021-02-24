import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthenService } from '../_services/authen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loading = false;
  submitted = false;

  constructor(public service: AuthenService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    this.service.formModel.reset();
  }

  lineApi = 'https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=4NrH6eNXkKpHdjxi5bxODy&redirect_uri=http://localhost:4200/home&scope=notify&state=';

  get f() { return this.service.formModel.controls; }

  onSubmit() {
    this.submitted = true;
    if(!this.service.formModel.valid)
      return;
    this.service.register()
      .pipe(first())
      .subscribe( data => {
              this.lineApi = this.lineApi + this.service.formModel.value.Email;
              console.log(this.lineApi);
              window.location.href = this.lineApi;
          },
          error => {
              console.log(error);
          });
  }
}