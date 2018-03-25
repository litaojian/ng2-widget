import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { CanActivate, CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BizQueryComponent } from './biz-query.component';

@Injectable()

export class BizPageGuardService implements CanActivate, CanDeactivate<BizQueryComponent> {

    constructor(private router: Router) {
        //console.log("BizPageGuardService ....");
    }


    canActivate(activatedRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        //console.log("BizPageGuardService canActivate ...." + activatedRoute.url.toString());
        //activatedRoute.data.test1 = "ltj1";
        return true;
    }


    canDeactivate(component: BizQueryComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {

        return confirm('You have unsaved message, are you sure to leave the page?')
    }
}