import { Injectable, Inject } from '@angular/core';

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

    constructor() {
        console.log("AppConfigService init ................................")
    }    
    // 服务器地址
    SERVER_URL:string;
    // 上下文路径    
    apiContextPath:string;

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
    }

}
