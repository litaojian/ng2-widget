import { Injectable,Injector } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseDataService }  from '../../../lib/base/base-data.service';

@Injectable()
export class HelloService extends BaseDataService {

    constructor(injector: Injector) {
        super(injector);
				
		this.setApiUrl("/api/rest/testRec");
		this.setIdField("testRecId");
		this.setValuelistTypes(["docStatus","dataType"]);
	}




}
