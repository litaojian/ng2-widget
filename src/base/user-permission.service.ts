import { Injectable,Injector } from '@angular/core';
import { Headers, Http, URLSearchParams,RequestOptions } from '@angular/http';
import { BaseDataService }  from './base-data.service';

import 'rxjs/add/operator/toPromise';

/**
 * 用户权限服务
 */
@Injectable()
export class UserPermissionService extends BaseDataService {
    constructor(injector: Injector) {
        super(injector);
    }
    
    checkMenuPermission(menuUrl:string, loginUserId:string) : Promise<Object> {
        let dataUrl = "/api/data/admin/checkMenuRight";
        let params = {"menuUrl":menuUrl, "loginUserId":loginUserId, "debug":false};
        return this.callServiceAPI(dataUrl, params);
    }
}

