import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { zip } from 'rxjs/observable/zip';
import { BaseStartupService } from '../../lib/base/base-startup.service';
import { AppConfigService } from '../../lib/bizapp.config';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService extends BaseStartupService {
    constructor(protected injector: Injector) { 
        super(injector);
    }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            zip(
                this.httpClient.get('assets/app-config.json')
            ).subscribe(([appConfig])  => {                
                const res = this.processConfigData(appConfig);
                resolve(res);
            }, (err: HttpErrorResponse) => {
                resolve(null);
            });
        });
    }

    processConfigData(configData:any){
        //debugger;
        // application data
        const res: any = configData;
        // 应用信息：包括站点名、描述、年份
        this.appConfig.setApp(res.app);
        this.appConfig.SERVER_URL = res.SERVER_URL;
    }
}
