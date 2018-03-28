import { Injectable,Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseDataService }  from '../base/base-data.service';


@Injectable()
export class BizDialogService extends BaseDataService {

    constructor(injector: Injector) {
        super(injector);
				
		//this.setApiUrl(apiUrl);
		//this.setIdField(idField);
	}

}
