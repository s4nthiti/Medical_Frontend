import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '../_services/authen.service';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {
  
  loading = false;
  submitted = false;

  constructor(public service: AuthenService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
    ) { 
      this.titleService.setTitle("Backend");
    }

  ngOnInit() {
    let key = localStorage.getItem('superAccess');
    if(key === 'true')
      this.router.navigate(['./home'], { relativeTo: this.route });
  }

  // convenience getter for easy access to form fields
  get f() { return this.service.loginModel.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.service.loginModel.invalid) {
          return;
      }

      this.loading = true;
      let res = this.service.login();
      if(res){
        this.router.navigate(['./home'], { relativeTo: this.route });
      }
      else{
        console.log('Password incorrect');
        this.loading = false;
      }
    }
  }