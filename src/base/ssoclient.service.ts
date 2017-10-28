import { Injectable, Injector} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HmacSHA256, enc } from 'crypto-js';

import { BaseService } from '../base/base-all.service';
import { CookieService } from './cookies.service';
import { environment } from '../environments/environment';


/**
 *  OAUTH登录服务处理类
 */
@Injectable()
export class SsoClientService extends BaseService {

  public static SSO_CHECKCODE_URL = "/sso/oauth/login/checkcode?";
  public static SSO_LOGOUT_URL    = "/sso/oauth/logout";
  private oauthAuthorizeUrl: string = "/oauth/authorize";
  private oauthTokenUrl: string     = "/oauth/token";

  private proxyUrl:string = "/remote/api/oauth2/token";

  constructor(protected http: Http, injector: Injector) {
    super(injector);  

    this.clientId = environment.clientId;

    if (environment["oauthAuthorizeUrl"] != null){
      this.oauthAuthorizeUrl =  environment["oauthAuthorizeUrl"];  
    }  

    if (environment["oauthTokenUrl"] != null){
      this.oauthTokenUrl = environment["oauthTokenUrl"];  
    }  
  }


/**
 * build sso login uri
 */
  buildLoginUrlForSSO(backtoUrl:string) {
    let ssoServerUrl = environment["ssoServerUrl"];
    if (ssoServerUrl != null) {
      let response_type = "code id_token";
      
      let ssoLoginUrl = ssoServerUrl + this.oauthAuthorizeUrl;
      //http://localhost/#/login
      let returnUrl = backtoUrl ? backtoUrl : '/';
      // 
      //debugger;
      let webRootUrl = this.findContextPath();

      //console.log("debug localWebUrl=" + webRootUrl);    
      let redirect_uri = encodeURIComponent(this.buildSsoCallbackUrl(returnUrl));
      //console.log("redirect_uri:" + redirect_uri);
      let logout_uri = encodeURIComponent(webRootUrl + "/sso/oauth/logout");
      let url = `${ssoLoginUrl}?client_id=${environment.clientId}&response_type=${response_type}&redirect_uri=${redirect_uri}&logout_uri=${logout_uri}`;
      //
      console.log("debug LoginUrlForSSO = " + url);
      return url;
    }
    return null;
  }

  buildSsoCallbackUrl(returnUrl){
    let webRootUrl = this.findContextPath();
    return webRootUrl + "/sso/oauth/login/checkcode?return_url=" + returnUrl;
  }

  
  verifySignature(content, signature, pType): boolean {
    let secretKey = environment.secert;
    let clientId = environment.clientId;
    //debugger;
    if (pType == 2){
      content = content + "," +  enc.Base64.stringify(enc.Utf8.parse(clientId));
      //console.log(content);
    }
    let text1 = HmacSHA256(content, secretKey);
    let signature1 = enc.Base64.stringify(text1);
    signature1 = signature1.split("=")[0];
    signature1 = signature1.replace(/\+/g, '-'); // 62nd char of encoding
    signature1 = signature1.replace(/\//g, '_'); // 63rd char of encoding

    let result = false;
    if (signature1 == signature) {
      result = true;
    }
    //console.log("result=" + result + ", signature1=" + signature1 + ", signature2=" + signature);
    return result;
  }

  /**
   * 
   */
  getSsoTokenByCode(code: string, backtoUrl: string, username: string, loginId: string) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = { "grant_type": "authorization_code" };
    
    params["code"] = code;
    params["redirect_uri"] = this.buildSsoCallbackUrl(backtoUrl);
    params["client_id"] = environment["clientId"];
    params["credentials"] =  "Basic " + enc.Base64.stringify(enc.Utf8.parse(environment["clientId"] + ":" + environment["secert"]));
    params["http_proxy_url"] = environment["ssoServerUrl"] + this.oauthTokenUrl;
   
    //			return "Basic " + ExDigestUtils.base64Encode(clientId + ":" + clientSecret);
    let url = this.proxyUrl;
    let api_context_path = environment.api_context_path;
    if (api_context_path != null && api_context_path != "/") {
      url = this.oauthTokenUrl.replace(this.proxyUrl, api_context_path + "/api/oauth2/");      
    }
    //debugger;
    return this.http.post(url, params, options)
      .map((res: Response) => res.json())
      .do(result => {
        //debugger;
        //console.log("debug1:" + url + "," + JSON.stringify(result));
        //"{"access_token":"13623a56-17f5-4d65-8cbd-29b27de087bd","token_type":"bearer","expires_in":36000,"refresh_token":"9188d834-ea14-4b14-81f1-e4dfeca759d7","enabled":0}"
        // set the cookie
        let userToken = JSON.parse(result["data"])["access_token"];
        if (userToken == null) {
          //debugger;
          let msg = "登录处理失败,未获得有效的token值";
          console.error(msg);
          alert(msg);
        } else {
          CookieService.save(this.clientId + "-username", username);
          CookieService.save(this.clientId + "-loginId", loginId);
          CookieService.save(this.clientId + "-userToken", userToken);
        }
        //CookieService.save(this.clientId +"-avatar", avatar);

      });
  }


  
}