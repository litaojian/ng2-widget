import { Injectable,Injector } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseDataService }  from '@yg-widget';
import { BizPageService }  from '@yg-widget';

@Injectable()
export class TestRecService extends BizPageService {

    constructor(injector: Injector) {
        super(injector);
				
		this.setApiUrl("/api/rest/testRec");
		this.setIdField("testRecId");
		this.setValuelistTypes(["docStatus","dataType"]);
	}

	update(updatedRow: Object): Observable<Object> {

		let result = super.update(updatedRow);
		//
		return result;
	}	





}
