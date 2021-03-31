import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '../_services/authen.service';
import jwt_decode from "jwt-decode";
import { AlertService } from '../_alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, public service: AuthenService, public alertService: AlertService, private route: ActivatedRoute) {}

  lineNotify = false;
  lineRegister = false;
  phoneNumber;
  userRole;
  lineApi = 'https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=4NrH6eNXkKpHdjxi5bxODy&redirect_uri=http://rightdoc.ddns.net:25566/callback&scope=notify&state=';

  ngOnInit(){
    if(this.checkLogin())
    {
      this.decodeToken();
      this.checkNotiRegister();
    }
  }

  logout(){
    localStorage.removeItem('token');
    this.alertService.success('ออกจากระบบแล้ว', { autoClose: true, keepAfterRouteChange: true });
    this.router.navigate(['/'], { relativeTo: this.route });
  }

  goTo($myParam: string = ''): void {
    const navigationDetails: string[] = [''];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    console.log(navigationDetails);
    this.router.navigate(navigationDetails);
  }

  toggleNotify() {
    this.service.toggleNotify(this.lineNotify).subscribe(res => {
      let response = JSON.stringify(res);
      this.lineNotify = JSON.parse(response).response;
    });
  }

  checkLogin() {
    return this.service.isAuthenticated();
  }

  decodeToken() {
    let token = localStorage.getItem('token');
    let decoded = JSON.stringify(jwt_decode(token));
    let jsonToken = JSON.parse(decoded);
    this.userRole = jsonToken.role;
    this.phoneNumber = jsonToken.phonenumber;
    this.service.getNotify().subscribe(res => {
      let response = JSON.stringify(res);
      this.lineNotify = JSON.parse(response).response;
    });
  }

  checkNotiRegister(){
    this.service.checkNotiUser().subscribe(res => {
      let response = JSON.stringify(res);
      this.lineRegister = JSON.parse(response).response;
    });
  }

  registerLineNoti() {
    this.lineApi = this.lineApi + this.phoneNumber;
    window.location.href = this.lineApi;
  }
  
}