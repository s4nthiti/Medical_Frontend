import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../_alert/alert.service';
import { AuthenService } from '../_services/authen.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  toggle = false;

  constructor(private router: Router, public service: AuthenService, public alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  toggleNav() {
    if(!this.toggle)
    {
      this.toggle = true;
      document.getElementById("mySidenav")!.style.width = "40%";
      document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    }
    else
    {
      this.toggle = false;
      document.getElementById("mySidenav")!.style.width = "0";
      document.body.style.backgroundColor = "rgba(0,0,0,0)";
    }
  }

  checkLogin() {
    return this.service.isAuthenticated();
  }

  logout(){
    localStorage.removeItem('token');
    this.alertService.success('ออกจากระบบแล้ว', { autoClose: true, keepAfterRouteChange: true });
    this.router.navigate(['/'], { relativeTo: this.route });
  }

}
