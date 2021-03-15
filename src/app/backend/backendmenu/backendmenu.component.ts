import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backendmenu',
  templateUrl: './backendmenu.component.html',
  styleUrls: ['./backendmenu.component.scss']
})
export class BackendmenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goTo($myParam: string = ''): void {
    const navigationDetails: string[] = ['/backend'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['./']);
  }

}
