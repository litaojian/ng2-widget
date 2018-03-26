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
import { BizQueryDialogComponent, BizFormDialogComponent } from './biz-dialog.component';

import { BizPageService } from './biz-page.service';
import { BizTreeTableComponent } from './biz-tree-table.component';
import { BizPageGuardService } from './biz-page-guard.service';



const COMPONENTS = [
	BizPageComponent,
	BizTreeTableComponent,
	BizQueryComponent,
	BizFormComponent
];
const DIRECTIVES = [		
];

const SERVICES = [
	NzMessageService,	
	NzModalService,
	BizPageService,
	BizFormService,
	BizQueryService,
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
		BizQueryDialogComponent,
		BizFormDialogComponent,
		...COMPONENTS,
		...DIRECTIVES	
	],
  providers:[
	...SERVICES
  ],
  entryComponents:[
	BizQueryDialogComponent,
	BizFormDialogComponent
  ]
})
export class BizAppModule {
   
}
