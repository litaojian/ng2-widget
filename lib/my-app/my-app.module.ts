import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MySelectComponent }  from './components/myselect.component';
import { MyUploaderComponent }  from './components/myuploader.component';
import { MyLookupComponent }  from './components/mylookup.component';
import { MyInputComponent }  from './components/myinput.component';
import { MyTreeComponent }  from './components/mytree.component';
import { ZxTreeComponent }  from './components/zxtree.component';
import { MyTreeSelectComponent }  from './components/mytreeselect.component';
import { MyLabelComponent }  from './components/mylabel.component';
import { MyTableComponent }  from './components/mytable.component';

import { ValuelistDirective }  from './directives/valuelist.directive';
import { ZxFormInputDirective }  from './directives/zx.forminput.directive';

import { MenuTreeService } from './services/menutree.service';
import { HttpClientService } from './services/httpclient.service';
import { BizFormService } from './biz-form.service';
import { BizQueryService } from './biz-query.service';
import { BizQueryComponent } from './biz-query.component';
import { BizFormComponent } from './biz-form.component';

import { ReuseTabService } from '@delon/abc';
//import { AppConfigService } from '../bizapp.config';

import { _HttpClient, ModalHelper } from '@delon/theme';
import { AlainThemeOptions, ALAIN_THEME_OPTIONS } from '@delon/theme';

const COMPONENTS = [
	MyTableComponent,
	MyUploaderComponent,
	MySelectComponent,
	MyLabelComponent,
	MyLookupComponent,
	MyUploaderComponent,
	MyInputComponent,
	MyTreeComponent,
	ZxTreeComponent,
	MyTreeSelectComponent,
	BizFormComponent,
	BizFormComponent
];
const DIRECTIVES = [		
	ZxFormInputDirective,
	ValuelistDirective
];

const SERVICES = [		
	_HttpClient,
	HttpClientService,
	MenuTreeService,
	BizQueryService,
	BizFormService,
	ModalHelper,
	ReuseTabService
];


@NgModule({
  imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		HttpClientModule,
		NgZorroAntdModule
  ],
  exports:[
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		...COMPONENTS,
		...DIRECTIVES		
  ],
  declarations: [
		...COMPONENTS,
		...DIRECTIVES	
	],
  entryComponents:[

  ]
})
export class MyAppModule {
  static forRoot(options?: Object): ModuleWithProviders {
	return {
		ngModule: MyAppModule,
		providers: [
			...SERVICES,
			{ provide: ALAIN_THEME_OPTIONS, useValue: {} }
		]
	};
}  
}
