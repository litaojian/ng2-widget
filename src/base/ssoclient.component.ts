import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CookieService } from './cookies.service';
import { HmacSHA256, enc } from 'crypto-js';
import { SsoClientService } from './ssoclient.service';


@Component({
  //templateUrl: './logout.component.html',
  template: `
    <div style="margin:50px;text-align:center;">
      <h2>{{message}}</h2>
      <a [href]="homeUrl" style="font-size:150%" *ngIf="isLogout">返回首页</a>
    </div>
    `
})


export class SsoClientComponent implements OnInit {
  message: string = "";
  isLogout: boolean = false;
  homeUrl: string = "/";

  constructor(private ssoClientService: SsoClientService, private router: Router) {

  }

  ngOnInit() {
    //debugger;
    //console.log("router url=" + this.router.url);

    if (this.router.url.startsWith(SsoClientService.SSO_CHECKCODE_URL)) {
      this.message = "正在处理登录请求";
      let id_token = this.ssoClientService.getUrlParam("id_token");
      let code = this.ssoClientService.getUrlParam("code");
      let return_url = this.ssoClientService.getUrlParam("return_url");
      let parts: any;
      let pType = 1;
      if (id_token != null) {
        parts = id_token.split(".");
      } else {
        parts = code.split(".");
        pType = 2;
      }
      //debugger;
      let content, payload, signature;
      if (pType == 1) {
        if (parts.length == 2) {
          content = parts[0];
          payload = parts[0];
          signature = parts[1];
        } else {
          content = parts[0] + "." + parts[1];
          payload = parts[1];
          signature = parts[2];
        }

      } else {
        if (parts.length == 3) {
          content = parts[0];
          payload = parts[1];
          signature = parts[2];
        } 
      }

      if (this.ssoClientService.verifySignature(content, signature, pType)) {
        let text: string;
        let username: string;
        let loginId: string;

        text = enc.Utf8.stringify(enc.Base64.parse(payload)); // ''
        //console.log("debug payload:" + text); //{"aud":"SheChe","sub":"43FE6476-CD7B-493B-8044-C7E3149E0888","name":"阳光耐特","login_name":"yangguangnaite","exp":1492074317650}
        let tmpJSON = JSON.parse(text);
        username = tmpJSON["name"];
        loginId = tmpJSON["login_name"];

        this.ssoClientService.getSsoTokenByCode(code, return_url, username, loginId).subscribe(result => {
          //console.log("debug result:" + JSON.stringify(result));
          if (result != null && result["resultCode"] == 0) {
            // Get the redirect URL from our auth service
            // If no redirect has been set, use the default
            let backtoUrl = return_url ? return_url : '/';
            console.log("backto redirect=" + backtoUrl);
            // Set our navigation extras object
            // that passes on our global query params and fragment
            let navigationExtras: NavigationExtras = {
              preserveQueryParams: false,
              preserveFragment: true
            };

            // Redirect the user
            this.router.navigate([backtoUrl], navigationExtras);
          } else {
            alert("单点登录失败");
          }
        });
      } else {
        //
        this.message = "登录处理错误,验签失败";
      }

    } else {
      this.homeUrl = this.ssoClientService.findContextPath();
      this.isLogout = true;
      this.message = "用户已登出";
    }

  }

}








