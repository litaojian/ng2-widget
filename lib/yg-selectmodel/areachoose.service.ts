import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams,RequestOptions } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
// import { environment } from '../../environments/environment';
@Injectable()
export class ChooseAreaService {
	constructor(private http: HttpClient) {}
    getCityValue(url: any,body:any):any{
	   return this.http
            .post(url,body);
	  
	}
    getCityList(url: any):any{
	   return this.http
            .get(url);
	  
	}
}
