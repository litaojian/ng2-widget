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

import { MenuTreeService } from '../base/menutree.service';
import { HttpClientService } from '../base/httpclient.service';
//import { AppConfigService } from '../bizapp.config';


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
	MyTreeSelectComponent
];
const DIRECTIVES = [		
	ZxFormInputDirective,
	ValuelistDirective
];

const SERVICES = [		
	HttpClientService,
	MenuTreeService
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

  ],
  providers: [
	  ...SERVICES
  ]
})
export class MyAppModule {
  constructor() {

  }
  static forRoot(options?: Object): ModuleWithProviders {
	return {
		ngModule: MyAppModule,
		providers: [
			...SERVICES
		]
	};
}  
}
