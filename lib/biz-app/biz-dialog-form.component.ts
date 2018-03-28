import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, Input, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../biz-form';
import { BizFormService } from './biz-form.service';
import { BizDialogComponent } from './biz-dialog.component';

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
    `,
    providers: [BizFormService]
})
export class BizDialogFormComponent extends BizDialogComponent {

    constructor(injector: Injector) {
        super(injector);    
    }

    @Input()
    set pageUrl(url: string) {
      this.bizService.pageUrl = url;
    }
    

}

