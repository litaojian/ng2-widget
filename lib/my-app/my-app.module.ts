import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, JsonpModule } from '@angular/http';
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

import { ValuelistDirective }  from './directives/valuelist.directive';
import { ZxFormInputDirective }  from './directives/zx.forminput.directive';


import { ZxTreeService } from './components/zxtree.service';
import { MenuTreeService } from '../base/base-menu-tree.service';

@NgModule({
  imports: [
		CommonModule,
		HttpModule,
		JsonpModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		NgZorroAntdModule
  ],
  exports:[
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		MyUploaderComponent,
		MySelectComponent,
		MyLabelComponent,
		MyLookupComponent,
		MyUploaderComponent,
		MyInputComponent,
		MyTreeComponent,
		ZxTreeComponent,
		MyTreeSelectComponent,
		ValuelistDirective,
		ZxFormInputDirective
  ],
  declarations: [
		MyUploaderComponent,
		MySelectComponent,
		MyLabelComponent,
		MyLookupComponent,
		MyUploaderComponent,
		MyInputComponent,
		MyTreeComponent,
		ZxTreeComponent,
		MyTreeSelectComponent,
		ValuelistDirective,
		ZxFormInputDirective
	],
  entryComponents:[

  ],
  providers: [
	MenuTreeService,
	ZxTreeService
  ]
})
export class MyAppModule {
  constructor() {

  }
}
