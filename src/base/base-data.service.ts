import { Injectable, Injector} from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { CookieService } from './cookies.service';
import { BaseService } from './base-all.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';



export class DataObject {

	constructor(){
		//super();
	}

	get [Symbol.species]() { 
		debugger;
		return null;
		//return Map; 
	}

	set [Symbol.species](val:any) { 
		debugger;
		//return Map; 
	}
	
}


@Injectable()
export class BaseDataService extends BaseService {
  
	//private headers = new Headers({ 'Content-Type': 'application/json' });
	protected apiUrl = '/api/rest/nosetting';  // URL to web API

	protected listViewUrl = '/main/nosetting/list';  // URL to web API
	protected formViewUrl = '/main/nosetting/get';  // URL to web API

	// protected listActionUrl = '/api/nosetting';  // URL to web API
	// protected saveActionUrl = '/api/nosetting/save';  // URL to web API
	// protected deleteActionUrl = '/api/nosetting/delete';  // URL to web API
	// protected updateActionUrl = '/api/nosetting/update';  // URL to web API
	protected idField: string = "id";

	constructor(injector: Injector) {
		super(injector);
		this.isTest = !environment.production; 
	}

	setIdField(value: string) {
		this.idField = value.toLowerCase();
		if (this.isTest) {
			this.idField = "id";		
		}	
	}
	getIdField() {
		return this.idField;
	}

	setIsTest(value: boolean) {
		this.isTest = value;
	}

	getIsTest(){
		return this.isTest;
	}

	getContextPath(url: string) {
		let pos = url.lastIndexOf(this.getListViewUrl());
		if (pos > 0){
			return url.substring(0, pos);
		}
		return "";
		
	}

	getApiUrl(){
		return this.apiUrl;
	}
	
	setApiUrl(url: string) {
		this.apiUrl = this.formatUrl(url);
		// 去掉前缀 'api/'
		//this.listViewUrl = url.replace("/api/", "")
		//this.formViewUrl = this.listViewUrl;	
		// if (!this.isTest) {
		// 	this.apiUrl = url.replace("/api/", "remote/api/");
		// 	let api_context_path = environment.api_context_path; 
		// 	if (api_context_path != null &&  api_context_path != "/"){
		// 		this.apiUrl = url.replace("/api/",  api_context_path + "/api/");			
		// 	}	
		// }
	}

	setPageViewUrl(url: string, view:string){
		if ("list" == view){
			this.setListViewUrl(url);		
			if (url.endsWith("/list")){
				this.setFormViewUrl(url.replace("/list", ""));
			}else{
				this.setFormViewUrl(url.replace("/index", ""));
			}
		}else if ("form" == view){
			this.setFormViewUrl(url);
			let pos = url.lastIndexOf("/edit");
			if (pos > 0){
				this.setListViewUrl(url.substring(0, pos));
				return;
			}
			pos = url.lastIndexOf("/view");
			if (pos > 0){
				this.setListViewUrl(url.substring(0, pos));
				return;
			}else{
				pos = url.lastIndexOf("/");
				if (pos > 0){
					this.setListViewUrl(url.substring(0, pos));
				}
			}
		}
		
		//
		CookieService.save("last_menu_url", this.base64Encode(url));
		// 

	}
	setListViewUrl(url: string) {
		this.listViewUrl = url;
	}

	getListViewUrl() {
		return this.listViewUrl;
	}

	setFormViewUrl(url: string) {
		this.formViewUrl = url;
	}

	getFormViewUrl() {
		return this.formViewUrl;
	}

	getAccessToken():string{
		let accessToken = CookieService.load(environment.clientId + "-userToken");
		return "Bearer " + accessToken;
	}

	create(newRow: Object): Promise<Object> {
		//debugger;
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken() });
		const url = `${this.apiUrl}`;
		let options = new RequestOptions({ 'headers': headers });
		return this.http.post(url, newRow, options).toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	update(updatedRow: Object): Promise<Object> {
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken() });
		let rowId = this.getValue(updatedRow, this.idField);
		const url = `${this.apiUrl}/${rowId}`;
		//debugger;
		return this.http
			.put(url, JSON.stringify(updatedRow), { "headers": headers })
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	delete(id: number): Promise<Object> {
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		const url = `${this.apiUrl}/${id}`;
		return this.http.delete(url, { "headers": headers })
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	getDetail(id: number | string): Promise<Object> {
		//debugger;
		if (id >= 0) {
			let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
			let options = new RequestOptions({ "headers": headers });
			let url = `${this.apiUrl}/${id}`;
			// if (this.getIdField() != "id"){
			// 	url = `${this.apiUrl}?${this.getIdField().toLowerCase()}=${id}`;
			// }
			return this.http.get(url, options)
				.toPromise()
				.then(response => { 
					let result = response.json();
					//debugger;					
					if (result["rows"] != null && result["rows"]  instanceof Array){
			           result["rows"] = result["rows"][0];
		            }
					return result;
				})
				.catch(error => this.handleError(url,error));
		} else {
			return Promise.resolve(new Object());
		}
		//
	}

	executeCmd(command:string, params:Object): Promise<Object> {
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken() });		
		const url = `${this.apiUrl}/${command}`;
		//debugger;
		return this.http
			.post(url, JSON.stringify(params), { "headers": headers })
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}


	getList(action: string, params: any, pageIndex: number, pageSize: number, customUrl?:string): Promise<Object> {
		//debugger;
		let url = this.apiUrl;
		if (customUrl != null){
			url = this.formatUrl(customUrl);
		}
		
		if (params != null && params['ajaxUrl'] != null){
			url = params['ajaxUrl'];
		}
		if (params == null){
			params = {};
		}
		let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		let options = new RequestOptions({
			headers: headers,
	  		search: this.bulidSearchString(action, params)
		});

		if (url.startsWith("http://") || url.endsWith(".json")){
			return this.getJSON(url);
		}

		if (this.isTest) {
			//debugger;
			return this.http.get(url, options)
				.toPromise()
				.then(response => response.json() as Object)
				.catch(error =>this.handleError(url,error));
		}
		if (customUrl == null){
			if (!url.endsWith(".json")){
				url = `${url}/query`;					
			}
		}
			
		params["pageIndex"] = pageIndex;
		params["pageSize"]  = pageSize;
		if (action == "query"){
			params["command"]  = "search";
		}
		// debugger;
		//调用后台数据接口的时候使用的发送请求的方式
		return this.http.post(url, params, options)
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	callServiceAPI(apiUrl: string, params: any): Promise<Object> {
		let tmp = params;
		if (params instanceof Array){
			tmp = {'data':params};
		}
		return this.ajaxPost(apiUrl, tmp).then(jsonData => {
            return jsonData;
        }).catch(error => {
			console.log("callServiceAPI error:" + error);
            return error;
        });
	}	


}
