import { Injectable,Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseDataService }  from '../base/base-data.service';
import { ReuseTabService } from '@delon/abc';

@Injectable()
export class BizPageService extends BaseDataService {

	reuseTabService: ReuseTabService;

    constructor(injector: Injector) {
        super(injector);
		//
		this.reuseTabService = injector.get(ReuseTabService);
	}

	onPageInit(resultData: any, pageUrl:string) {
		
	}	
}
