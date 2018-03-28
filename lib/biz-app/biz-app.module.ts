import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule, NzMessageService, NzModalService } from 'ng-zorro-antd';

import { MyTreeModule } from '../my-tree';
import { BizSimpleTableModule } from '../biz-table';
import { BizSchemaFormModule } from '../biz-form';

import { BizFormService } from './biz-form.service';
import { BizQueryService } from './biz-query.service';
import { BizQueryComponent } from './biz-query.component';
import { BizFormComponent } from './biz-form.component';
import { BizPageComponent } from './biz-page.component';
import { BizDialogQueryComponent } from './biz-dialog-query.component';
import { BizDialogFormComponent } from './biz-dialog-form.component';
import { BizDialogTreeComponent } from './biz-dialog-tree.component';
import { BizTreeTableComponent } from './biz-tree-table.component';

import { BizPageService } from './biz-page.service';
import { BizTreeService } from './biz-tree.service';
import { BizPageGuardService } from './biz-page-guard.service';



const COMPONENTS = [
	BizPageComponent,
	BizTreeTableComponent,
	BizQueryComponent,
	BizFormComponent,
	BizDialogTreeComponent
];
const DIRECTIVES = [		
];

const SERVICES = [
	NzMessageService,	
	NzModalService,
	BizPageService,
	BizPageGuardService
];


@NgModule({
  imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		NgZorroAntdModule,
		MyTreeModule,
		BizSimpleTableModule.forRoot(),
		BizSchemaFormModule.forRoot(),
  ],
  exports:[
		...COMPONENTS,
		...DIRECTIVES		
  ],
  declarations: [
		BizDialogQueryComponent,
		BizDialogFormComponent,
		...COMPONENTS,
		...DIRECTIVES	
	],
  providers:[
	...SERVICES
  ],
  entryComponents:[
	BizDialogQueryComponent,
	BizDialogFormComponent,
	BizDialogTreeComponent
  ]
})
export class BizAppModule {
   
}
