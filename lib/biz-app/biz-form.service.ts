import { Injectable,Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BizPageService }  from './biz-page.service';

@Injectable()
export class BizFormService extends BizPageService {

    constructor(injector: Injector) {
        super(injector);
				
		//this.setApiUrl(apiUrl);
		//this.setIdField(idField);
	}

}
