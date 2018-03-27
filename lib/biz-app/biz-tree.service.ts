import { Injectable,Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BizQueryService }  from './biz-query.service';

@Injectable()
export class BizTreeService extends BizQueryService {

    navTree: any = {
        nzXs:18,
        nzSm:12,
        nzMd:6,
        nzLg:5,
        nzXl:4,
        dataUrl: ''
    };

    selectNodeId:string = "0";

    constructor(injector: Injector) {
        super(injector);
	}

    onPageInit(resultData: any, url:string, actions:Object[]) {
        
        super.onPageInit(resultData, url, actions);

        if (resultData["navTree"]){
            
            Object.keys(resultData["navTree"]).forEach((propKey: string) => {
                this.navTree[propKey] = resultData["navTree"][propKey];
            });
            
            if (this.navTree.dataUrl) {
                this.navTree.dataUrl = this.formatUrl(this.navTree.dataUrl);
            } 
        }
                    
    }    

}
