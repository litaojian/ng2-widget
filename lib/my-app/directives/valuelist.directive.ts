// tslint:disable
import { NzMessageService } from 'ng-zorro-antd';
import { Directive, ElementRef, Input, HostListener, OnInit} from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';


/**
 * 
 * ```html
 * <select valuelist valuelist-type="roleType"></select>
 * ```
 */
@Directive({ selector: '[valuelist]' })
export class ValuelistDirective implements OnInit {

    /** 值列表参数 */
    @Input('valuelist-type') valuelistType: string;
    
    options:Object[] = [
        { label:"业务" , value:"Business"  },
        { label:"bbb" , value:"222"  }
    ];

    constructor(
        private el: ElementRef,
        private http: HttpClient,
        private msgSrv: NzMessageService) {
    }

    ngOnInit() {
        console.log("ValuelistDirective ......");
        
    }
}
