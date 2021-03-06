  
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenService } from '../_services/authen.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenService
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
    {
        if (!this.authenticationService.isAuthenticated()) {
            return true;
        }
        
        // navigate to login page
        this.router.navigate(['']);
        // you can save redirect url so after authing we can move them back to the page they requested
        return false;
    }
}