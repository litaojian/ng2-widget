import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from './base/services/local-storage.service';


export interface BizAppConfig {
    [key: string]: any;

    /**
     * 后端网址，建议配合 `environment` 一起使用
     */
    SERVER_URL: string;
}    

export interface App {
    name?: string;
    description?: string;
    year?: number;
    [key: string]: any;
}

@Injectable()
export class AppConfigService {

    protected localStorageService:LocalStorageService = new LocalStorageService();

    constructor(serverUrl?:string) {
        console.log("AppConfigService init ................................");
        if (serverUrl){
            this.setServerURL(serverUrl);
        }        
    }    
    // 服务器地址
    SERVER_URL:string;
    // 上下文路径    
    apiContextPath:string;

    clientId:string;

    // 应用配置参数
    app: App = {
        year: (new Date()).getFullYear()
    };
    
    private get(key: string) {
        return JSON.parse(localStorage.getItem(key) || 'null') || null;
    }

    private set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    setApp(val: App) {
        this.app = Object.assign(this.app, val);
    }

    setServerURL(url:string){
        this.SERVER_URL = url;
        this.localStorageService.set("apiServerUrl", url);
    }

    getApiServerUrl(){
        if (!this.SERVER_URL){
            this.SERVER_URL = this.localStorageService.get("apiServerUrl");
        }
        return this.SERVER_URL;
    }
}
