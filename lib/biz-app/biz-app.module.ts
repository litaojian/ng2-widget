import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AdSimpleTableModule } from '@yg-widget/biz-table';
import { NzSchemaFormModule } from '@yg-widget/biz-form';

import { BizFormService } from './biz-form.service';
import { BizQueryService } from './biz-query.service';
import { BizQueryComponent } from './biz-query.component';
import { BizFormComponent } from './biz-form.component';

const COMPONENTS = [
	BizQueryComponent,
	BizFormComponent
];
const DIRECTIVES = [		
];

const SERVICES = [	
	BizFormService,
	BizQueryService
];


@NgModule({
  imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		NgZorroAntdModule,
		NzSchemaFormModule.forRoot(),
		AdSimpleTableModule.forRoot(),
  ],
  exports:[
		...COMPONENTS,
		...DIRECTIVES		
  ],
  declarations: [
		...COMPONENTS,
		...DIRECTIVES	
	],
  providers:[
	...SERVICES
  ],
  entryComponents:[

  ]
})
export class BizAppModule {
   
}
