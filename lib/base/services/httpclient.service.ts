import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { ExtCookieService } from './cookies.service';
import { BaseHttpService } from '../base-http.service';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { tap, catchError } from 'rxjs/operators';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';


export class HttpClientService extends BaseHttpService {

	private clientId:string;
	private apiContextPath:string;
	private apiServerUrl = "remote/api/";
	
	public setClientId(_clientId:string){
		this.clientId = _clientId;
	}

	public setApiContextPath(_apiContextPath:string){
		this.apiContextPath = _apiContextPath;
	}

	public setApiServerUrl(_apiServerUrl:string){
		this.apiContextPath = _apiServerUrl;
	}

    public getUrlParams():any {
        return "test it !!!";
    }

    getAccessToken(): string {
		let accessToken = ExtCookieService.load(this.clientId + "-userToken");
		return "Bearer " + accessToken;
	}
	
	getHttpHeader(isDebug?:boolean):HttpHeaders{
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
		return this._httpClient.post(url, params, options)
			.do(response => response as Object)
			.catch(error => this.handleErrorForObservable(url,error));
	}

    ajaxGet(ajaxUrl: string, params: any): Observable<Object> {		
		let options = {
			headers: this.getHttpHeader(params["debug"]),
			search: this.bulidSearchString("", params)
		};

		const httpParams = new HttpParams();

		let url = this.formatUrl(ajaxUrl);
		//调用后台数据接口的时候使用的发送请求的方式
		return this._httpClient.get(url, options)
			.do(response => response)
			.catch(error => this.handleErrorForObservable(url,error));
    }
	
	ajaxLoad(ajaxUrl: string): Observable<Object> {
		let options = {
			headers: this.getHttpHeader()
		};		
		let url = this.formatUrl(ajaxUrl);
		//获取Html文本
		return this._httpClient.get(url, options)
			.catch(error => this.handleErrorForObservable(url,error));
	}


	handleErrorForObservable(url:string, error: any): Observable<any> {
		//console.error('An error occurred', error); // for demo purposes only
		//return Observable.of(error.message || error);
		return ErrorObservable.create(error.message || error);
	}

	formatUrl(ajaxUrl: string): string {
		//debugger;
		let url = ajaxUrl;
		let apiServerUrl = "remote/api/";
		
		if (!ajaxUrl.startsWith("http://") && ajaxUrl.startsWith("/api/")) {
			url = ajaxUrl.replace("/api/", apiServerUrl);			
			let api_context_path = this.apiContextPath;
			if (api_context_path != null && api_context_path != "/") {
				url = ajaxUrl.replace("/api/", api_context_path + "/api/");
			}
		}
		return url;
	}

	bulidSearchString(action: string, params: any) {
		let searchString: URLSearchParams = new URLSearchParams();
		if (action == "query" || action == "search") {
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
		return searchString;
	}


}
