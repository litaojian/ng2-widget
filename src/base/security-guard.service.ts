import { Injectable, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { Http } from '@angular/http';

import { environment } from '../environments/environment';
import { BaseService } from '../base/base-all.service';
import { CookieService } from './cookies.service';
import { SsoClientService } from './ssoclient.service';
import { UserPermissionService } from './user-permission.service';

import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';


@Injectable()
export class SecurityGuardService extends BaseService implements CanActivate, CanActivateChild, CanLoad {

  //private redirectUrl: string;

  private userInfo: Object;

  constructor(injector:Injector,private router: Router, private location: Location, private ssoClientService:SsoClientService, private userPermissionService:UserPermissionService, protected http:Http) {
    //console.log("This is SecurityGuardService Service.")
    super(injector);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.processTask(route, state, "canActive");
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<boolean> {
    return this.processTask(route, state, "canActivateChild");
  }

  canLoad(route: Route):   Promise<boolean> {
    let url = `/${route.path}`;
    return this.checkLoginAndPermission(url);
  }

  processTask(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, cmd:string){

    //debugger;
    let url: string = state.url;
    //console.log( cmd + "-url:" + url);
      
    //return true;
    if (url == "/login" || url.startsWith("/login?session") || url.startsWith("/oauth/") ){
      let sso_login_url = this.ssoClientService.buildLoginUrlForSSO(url);
      if (sso_login_url != null){
          // 跳转到单点登录页面
          window.location.href = sso_login_url;
          return Promise.resolve(false);
      }else{
        return Promise.resolve(true);
      }
    }
    
    //debugger;
    return this.checkLoginAndPermission(url);

  }

  loadUserInfo(): Object {

    if (this.userInfo == null) {
      let username = CookieService.load(environment.clientId + "-username");
      let avatar = CookieService.load(environment.clientId + "-avatar");
      let userToken = CookieService.load(environment.clientId + "-userToken");

      if (username != null) {
        this.userInfo = new Object();
        this.userInfo["username"] = username;
        this.userInfo["avatar"] = avatar;
        this.userInfo["userToken"] = userToken;
      }
    }

    return this.userInfo;
  }

  isLoggedIn(): boolean {
    if (this.userInfo != null) {
      return true;
    }
    return false;
  }

  checkLoginAndPermission(url: string): Promise<boolean> {
    //debugger;
    this.loadUserInfo();

    if (this.isLoggedIn()) {
      return this.checkUserPermission(url);
    }

    // Store the attempted URL for redirecting
    console.log("checkLogin url=" + url);
    console.log("debug: userInfo=" + JSON.stringify(this.userInfo));

    this.goLoginPage(url);
    return Promise.resolve(false);
  }

  checkUserPermission(url: string) : Promise<boolean>{
    // 调用后台接口检查当用用户权限    
    return this.userPermissionService.checkMenuPermission(url, this.userInfo["username"]).then(
      result => {
        // 根据后台返回数据处理
        let resultCode:number = result["resultCode"]; 
        let resultMsg:string = result["resultMsg"];    
        if (resultCode == 0){
          // 用户有权限
          return true;
          //return Promise.resolve(true);
        }

        //debugger;
        this.goErrorPage(resultCode, resultMsg, url);
        return false;
      }
    );
  }

  goErrorPage(resultCode:number, resultMsg:string, menuUrl:string): boolean {
    
    // Create a dummy session id
    let sessionId = this.guid();

    // Set our navigation extras object
    // that contains our global query params and fragment
   
    let navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    // Navigate to the access denid page with extras
    navigationExtras.queryParams["errorCode"]=resultCode;
    navigationExtras.queryParams["errorMsg"]=resultMsg;
    navigationExtras.queryParams["url"]=menuUrl;
    this.router.navigate(['/sso/error'], navigationExtras);
    return false;      
  }

  goLoginPage(menuUrl:string): boolean {
    
    // Create a dummy session id
    let sessionId = this.guid();

    // Set our navigation extras object
    // that contains our global query params and fragment
    
    // let navigationExtras: NavigationExtras = {
    //   queryParams: { 'session_id': sessionId, 'redirectUrl':url },
    //   fragment: 'anchor'
    // };

    let navigationExtras: NavigationExtras = {
      queryParams: { 'session_id': sessionId, 'redirectUrl':menuUrl }
    };

    let sso_login_url = this.ssoClientService.buildLoginUrlForSSO(menuUrl);
    if (sso_login_url != null) {
      // 跳转到单点登录页面
      window.location.href = sso_login_url;
      return false;
    }

    let loginUrl = environment["loginUrl"];
    if (loginUrl != null) {
      // 跳转到本地登录页面
      window.location.href = loginUrl;
      return false;
    }
    // Navigate to the login page with extras
    this.router.navigate(['/sso/login'], navigationExtras);
    return false;
  }



  guid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}
