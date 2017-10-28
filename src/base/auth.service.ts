import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from './base-all.service';
import { CookieService } from './cookies.service';
import { SsoClientService } from './ssoclient.service';

import { environment } from '../environments/environment';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

/**
 *  登录信息
 */
export class LoginInfo {
  loginId: string;
  password: string;
  email: string;
  mobile: string;
  loginType: string = "password";
  remeberMe: boolean;

  public setLoginId(loginId: string) {
    this.loginId = loginId;
  }

  public setPassword(password: string) {
    this.password = password;
  }

}

/**
 * 用户信息
 */
export class UserInfo {
  userId: number;
  loginId:string;
  username: string;
  avatar: string;
  orgCode: string;
  orgName: string;
  roles: string;
  email: string;
  mobile: string;
  userToken: string;
}

@Injectable()
export class AuthService extends BaseService {
  //是否已登录
  isLoggedIn: boolean = false;
  //用户信息
  userInfo: UserInfo;

  //用户认证API
  authApiUrl: string = "/api/loginAccounts"


  clientId: string;

  //loginActionEvent:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(injector: Injector) {
    super(injector);
    //
    //console.log("AuthService init ..... username in cookie:" + CookieService.load("username"))

    this.loadUserInfo();

    this.clientId = environment.clientId;

  }

  loadUserInfo() {
    if (this.userInfo == null) {
      let loginId = CookieService.load(this.clientId + "-loginId");      
      let username = CookieService.load(this.clientId + "-username");
      let avatar = CookieService.load(this.clientId + "-avatar");
      let userToken = CookieService.load(this.clientId + "-userToken");

      if (username != null) {
        this.userInfo = new UserInfo();
        this.userInfo.loginId = loginId;
        this.userInfo.username = username;
        this.userInfo.avatar = avatar;
        this.userInfo.userToken = userToken;
        this.isLoggedIn = true;
      }
    }
  }
  
  handleError(error: any): Promise<any> {
    //console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  login(loginInfo: LoginInfo): Observable<Object> {
    // 输入参数
    //console.log("login form data:" + JSON.stringify(loginInfo));
    if (loginInfo.loginId == null) {
      return Observable.of({ errmsg: 'loginId is null.', errcode: 10001 });
    }
    if (loginInfo.password == null) {
      return Observable.of({ errmsg: 'password is null.', errcode: 10002 });
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    
    let url:string = this.formatUrl("/api/login/userPassword");      
    let params = {"loginId":loginInfo.loginId, "password": loginInfo.password};
    return this.http.post(url, params, options)
        .map((res: Response) => res.json())
        .do(result => this.processLoginResult(result, loginInfo.loginId, loginInfo.password));
     
    
    //return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  }
  /**
   * 
   * @param result 
   * @param loginId 
   * @param password 
   */
  processLoginResult(result: any, loginId: string, password: string) {
    //debugger;
    //console.log("debug1:" + JSON.stringify(result));
    //console.log("debug2:" + (result.data.password == loginInfo.password));
    if (result.data == null){
      result["data"] = {};
    }

    if (result.data != null && result.data.id != null && result.data.password == password) {
      this.userInfo = new UserInfo();
      this.userInfo.userId = result.data.id;
      this.userInfo.username = result.data.username;
      this.userInfo.email = result.data.email;
      this.userInfo.avatar = result.data.avatar;
      this.userInfo.userToken = result.data.token;

      this.isLoggedIn = true;
      result.data.password = null;
      // set the cookie
      CookieService.save(this.clientId + "-loginId", loginId);
      CookieService.save(this.clientId + "-username", this.userInfo.username);
      CookieService.save(this.clientId + "-avatar", this.userInfo.avatar);
      CookieService.save(this.clientId + "-userToken", this.userInfo.userToken);

      // let actionEvent = new Event("loginActionEvent");
      // document.dispatchEvent(actionEvent);

    } else if (result["userToken"] != null && result["resultCode"] == 0){
      
      //login result:{"resultMsg":"登录成功","loginId":"user1","userToken":"g2r7oTYQQYEHK9baW3v1L9mqZ1Sc67A8","orgCode":"1003","resultCode":0,"userName":"t3","backtoUrl":"index.html","data":{"errmsg":"Password is wrong"}}
      this.userInfo = new UserInfo();
      this.userInfo.userId = result.userId;
      this.userInfo.username = result.userName;
      this.userInfo.email = result.email;
      this.userInfo.avatar = result.avatar;
      this.userInfo.userToken = result.userToken;
      this.userInfo.orgCode = result.orgCode;

      this.isLoggedIn = true;
      result.data.password = null;
      // set the cookie
      CookieService.save(this.clientId + "-loginId", loginId);
      CookieService.save(this.clientId + "-username", this.userInfo.username);
      CookieService.save(this.clientId + "-avatar", this.userInfo.avatar);
      CookieService.save(this.clientId + "-userToken", this.userInfo.userToken);

    } else {
      this.isLoggedIn = false;      
      result.data = {};
      result.data.errmsg = "Password is wrong";
    }

  }

  logout(): string {
    this.isLoggedIn = false;
    CookieService.remove(this.clientId + "-loginId");
    CookieService.remove(this.clientId + "-username");
    CookieService.remove(this.clientId + "-avatar");
    CookieService.remove(this.clientId + "-userToken");
    //debugger;
    let logoutUrl = this.buildLogoutUrlForSSO();
    if (logoutUrl == null) {
      logoutUrl = "/sso/login";
    }
    return logoutUrl;
  }


  /**
 * build sso logout uri
 */
  buildLogoutUrlForSSO() {
    let ssoServerUrl = environment["ssoServerUrl"];
    if (ssoServerUrl != null) {
      let return_url = this.findContextPath() + SsoClientService.SSO_LOGOUT_URL;
      let oauthLogoutUrl = "/logout?post_logout_redirect_uri=";

      if (environment["oauthLogoutUrl"] != null){
        oauthLogoutUrl = environment["oauthLogoutUrl"];  
      }  
      return ssoServerUrl + oauthLogoutUrl + encodeURIComponent(return_url);
    }
    return null;
  }


}
