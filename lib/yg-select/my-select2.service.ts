import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams,RequestOptions } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
// import { environment } from '../../environments/environment';
@Injectable()
export class SelectService {
	constructor(private http: HttpClient) {}
    getValue(url: any):any{
	   return this.http
            .get(url);
	  
	}
}
