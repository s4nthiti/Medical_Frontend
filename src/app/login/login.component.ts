import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../_alert/alert.service';
import { AuthenService } from '../_services/authen.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  submitted = false;

  constructor(public service: AuthenService, private router: Router, private route: ActivatedRoute, public alertService: AlertService) { }

  ngOnInit(): void {
  }

  get f() { return this.service.loginModel.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.service.loginModel.invalid) {
        return;
    }

    this.loading = true;
    this.service.login().subscribe(data => {
        let jwtToken = JSON.stringify(data);
        let token = JSON.parse(jwtToken);
        localStorage.setItem('token', token.jwtToken);
        this.alertService.success('เข้าสู่ระบบ', { autoClose: true, keepAfterRouteChange: true });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error => {
        console.log(error);
        this.alertService.error(error.error.message);
        this.loading = false;
    });
  }
}
