import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, Input, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../biz-form';
import { BizDialogService } from './biz-dialog.service';
import { BizPageComponent } from './biz-page.component';

@Component({
    selector: 'bizdialog-form',
    template: `
        <div class="mb-md">
            <my-simple-form #myQueryForm [layout]="queryForm.layout"
                    [schema]="queryForm.schema"
                    [model]="queryForm.model"
                    [actions]="actions">
            </my-simple-form>
        </div>
    `
})
export class BizDialogFormComponent extends BizPageComponent {

    constructor(injector: Injector) {
        super(injector);    
    }

    @Input()
    set pageUrl(url: string) {
      this.bizService.pageUrl = url;
    }
    
    

}

