import { Injector, Optional, SkipSelf } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { enc } from 'crypto-js';
import { ExtCookieService } from './cookies.service';
import { HttpClientService } from './httpclient.service';
import { AppConfigService } from '../bizapp.config';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';



export class BaseService {

	protected httpClient: HttpClientService;

	protected appConfig:AppConfigService;
	
	protected injector: Injector;

	protected isTest: boolean = true;

	protected isHashMode = true;

	protected clientId;

	protected apiContextPath;

	constructor(injector: Injector) {

		this.httpClient = injector.get(HttpClientService);
		this.appConfig = injector.get(AppConfigService);

		//this.jsonp = injector.get(Jsonp);
		//this.isTest  = !environment.production;
		//this.clientId = environment['clientId'];
	}

	
	public getLoginId():Object {
		let loginId = ExtCookieService.load(this.clientId + "-loginId");		
		return loginId;
	}

	public getLoginUser():Object {
		let userInfo = {};
		userInfo["username"] = ExtCookieService.load(this.clientId + "-username");
		userInfo["avatar"] = ExtCookieService.load(this.clientId + "-avatar");
		userInfo["userToken"] = ExtCookieService.load(this.clientId + "-userToken");
		userInfo["loginId"] = ExtCookieService.load(this.clientId + "-loginId");		
		return userInfo;
	}

	public base64Encode(input: string) {
		if (input == null) {
			return null;
		}
		return enc.Base64.stringify(enc.Utf8.parse(input));
	}
	
	public base64Decode(input: string) {
		if (input == null) {
			return null;
		}
		return enc.Utf8.stringify(enc.Base64.parse(input));
	}

	parseUrlParams(queryString: string) {
		//debugger;
		let segments = queryString.split("&");
		let resultObj = {};
		if (segments != null) {
			for (let i = 0; i < segments.length; i++) {
				let values = segments[i].split("=");
				resultObj[values[0]] = values[1];
			}
		}
		return resultObj;
	}

	// ******************************
	// 获取URL中的参数
	// ******************************  
	getUrlParam(paramName: string) {
		let requestUrl = window.location.href;
		let pos = requestUrl.indexOf("?");
		let reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
		let r = requestUrl.substr(pos).match(reg); // 匹配目标参数
		if (r != null)
			return decodeURIComponent(r[2]);

		reg = new RegExp("(^|/\?)" + paramName + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
		r = requestUrl.substr(pos).match(reg); // 匹配目标参数
		if (r != null)
			return decodeURIComponent(r[2]);

		return null; // 返回参数值
	}

	// ******************************
	// 获取当前contextPath
	// *******************************
	findContextPath() {
		let path = null;
		//debugger;
		//var path = CookieService.load('contextPath');
		if (path == null) {
			// var links = document.links;
			// for(let i = 0; i < links.length;i++){
			//   var href = links[i]["href"];
			//   console.log(href);
			// }  
			var scripts = document.scripts;
			for (let i = 0; i < scripts.length; i++) {
				var src = scripts[i]["src"];
				//console.log(src);
				var lastIndex = src.indexOf('vendor.');
				if (lastIndex != -1) {
					path = src.substring(0, lastIndex);
				}
			}
		}
		if (this.isHashMode) {
			path = path + "#";
		}
		// console.log("the web context is " + path);
		return path;
	}

	getAccessToken(): string {
		let accessToken = ExtCookieService.load(this.clientId + "-userToken");
		return "Bearer " + accessToken;
	}
	
	getHttpHeader(isDebug?):HttpHeaders{
		let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.getAccessToken() });
		if (isDebug != null && isDebug == true) {
			headers = new HttpHeaders({ 'debug': 'ltj', 'Content-Type': 'application/json', 'Authorization': this.getAccessToken() });
		}
		return headers;
	}

	ajaxPost(ajaxUrl: string, params: any): Observable<Object> {
		let options = {
			headers: this.getHttpHeader(params["debug"])
		};
		
		let url = this.formatUrl(ajaxUrl);
		//调用后台数据接口的时候使用的发送请求的方式
		return this.httpClient.post(url, params, options)
			.do(response => response as Object)
			.catch(error => this.handleError(url,error));
	}

	ajaxGet(ajaxUrl: string, params: any): Observable<Object> {		
		let options = {
			headers: this.getHttpHeader(params["debug"]),
			search: this.bulidSearchString("", params)
		};

		const httpParams = new HttpParams();

		let url = this.formatUrl(ajaxUrl);
		//调用后台数据接口的时候使用的发送请求的方式
		return this.httpClient.get(url, options)
			.do(response => response)
			.catch(error => this.handleError(url,error));
	}
	
	ajaxLoad(ajaxUrl: string): Observable<Object> {
		let options = {
			headers: this.getHttpHeader()
		};		
		let url = this.formatUrl(ajaxUrl);
		//获取Html文本
		return this.httpClient.get(url, options)
			.catch(error => this.handleError(url,error));
	}

	getJSON(dataUrl: string, options?: Object): Observable<Object> {
		//debugger;

		return this.httpClient.get(dataUrl, options)
			.do(response => response as Object)
			.catch(error => this.handleError(dataUrl,error));
	}

	getDataByProxy(dataUrl: string): Observable<Object> {
		//debugger;
		//获取JSON数据
		let requestUrl = "/api/data/http_proxy"
		let url = this.formatUrl(requestUrl);
		let options = {
			params: {
				"http_proxy_url": dataUrl
			}
		};

		return this.httpClient.post(url, options)
			.do(response => response as Object)
			.catch(error => this.handleError(url,error));
	}

	bulidSearchString(action: string, params: any) {
		let searchString: URLSearchParams = new URLSearchParams();
		if (!this.isTest && (action == "query" || action == "search")) {
			searchString.set("command", "search");
		}

		//if (params != null) debugger;
		for (let k in params) {
			if (k == "command") {
				continue;
			}
			if (params[k] !== '') {
				searchString.set(k, params[k]);
			}
		}

		//console.log(JSON.stringify(params) + "-----" + JSON.stringify(searchString));
		return searchString;
	}

	formatUrl(ajaxUrl: string): string {
		//debugger;
		let url = ajaxUrl;
		let apiServerUrl = "remote/api/";
		if (this.appConfig.SERVER_URL){
			apiServerUrl = this.appConfig.SERVER_URL;			
		}
		if (!ajaxUrl.startsWith("http://") && ajaxUrl.startsWith("/api/")) {
			url = ajaxUrl.replace("/api/", apiServerUrl);			
			if (this.isTest){
				//url = ajaxUrl.replace("remote/api/", "remote/mock/api/");				
			}
			let api_context_path = this.apiContextPath;
			if (api_context_path != null && api_context_path != "/") {
				url = ajaxUrl.replace("/api/", api_context_path + "/api/");
			}
		}
		return url;
	}

	handleErrorForObservable(error: any): Observable<any> {
		//console.error('An error occurred', error); // for demo purposes only
		//return Observable.of(error.message || error);
		return ErrorObservable.create(error.message || error);
	}

	handleErrorForPromise(error: any): Promise<any> {
		//console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}


	handleError(url:string, error: any): Promise<any> {
		let result = {};
		let _body = error["_body"];
		if (_body){
			console.log(error["status"] + ":" + _body);		
		}else{
			console.log("error url:" + url);			
			console.log(error);
		}
		try {
			let jsonResult = JSON.parse(_body);
			result["resultCode"] = jsonResult["resultCode"];
			result["resultMsg"] = jsonResult["resultMsg"];
			result["description"] = jsonResult["未获得有效授权"];
		} catch (error) {
			result["resultCode"] = error["status"];
			result["resultMsg"] = error["statusText"];
			result["description"] = _body;
		}

		if (result["resultCode"] == null) {
			result["resultCode"] = error["status"];
			result["resultMsg"] = error["statusText"];
			result["description"] = _body;
		}
		//console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(result);
	}
	/**
	 * 
	 * @param dataObject 
	 * @param field 
	 */
	getValue(dataObject: Object, field: string) {
		//debugger;
		let elements = Object.keys(dataObject).sort();
		for (let i = 0; i < elements.length; i++) {
			if (field.toLowerCase() == elements[i].toLowerCase()) {
				return dataObject[elements[i]];
			}
		}
		return dataObject[field];
	}

	getKeys(item){
		return Object.keys(item).sort();
	}

	storeCookie(path, value){
		ExtCookieService.save(path, value);
	}

	loadCookie(path){
		return ExtCookieService.load(path);
	}
}

