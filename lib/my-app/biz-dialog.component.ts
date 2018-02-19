import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '..//biz-form';
import { BizDialogService } from './biz-dialog.service';

@Component({
    selector: 'app-biz-dialog',
    providers:[BizDialogService]
})
export class BizQueryDialogComponent {

    constructor(injector: Injector) {
        //this.msgService = injector.get(NzMessageService);
        //this.bizService = injector.get(BizDialogService);

        //this.activatedRoute = injector.get(ActivatedRoute);
        //this.router = injector.get(Router);
    
    }

    

}



@Component({
    selector: 'app-biz-dialog',
    providers:[BizDialogService]
})
export class BizFormDialogComponent {

    constructor(injector: Injector) {
        //this.msgService = injector.get(NzMessageService);
        //this.bizService = injector.get(BizDialogService);

        //this.activatedRoute = injector.get(ActivatedRoute);
        //this.router = injector.get(Router);
    
    }

    

}