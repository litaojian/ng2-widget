import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../biz-form';
import { BizDialogService } from './biz-dialog.service';
import { BizPageComponent } from './biz-page.component';

@Component({
    selector: 'bizform-dialog',
    template: `
        <p>form dialog </p>
    `
})
export class BizFormDialogComponent extends BizPageComponent {

    constructor(injector: Injector) {
        super(injector);    
    }

    

}

