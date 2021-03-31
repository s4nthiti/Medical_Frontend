import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthenService } from '../_services/authen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../_alert/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loading = false;
  submitted = false;

  constructor(public service: AuthenService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, public alertService: AlertService) {}

  ngOnInit(){
    this.service.formModel.reset();
  }

  lineApi = 'https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=4NrH6eNXkKpHdjxi5bxODy&redirect_uri=http://34.126.120.13/callback&scope=notify&state=';

  get f() { return this.service.formModel.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.service.formModel.invalid) {
        return;
    }

    this.loading = true;
    this.service.register().subscribe(data => {
        this.alertService.success('ลงทะเบียนสำเร็จ', { autoClose: true, keepAfterRouteChange: true });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error => {
        console.log(error);
        this.alertService.error(error.error.message);
        this.loading = false;
    });
  }
}