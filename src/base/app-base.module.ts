import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { MyTableComponent }  from '../base/mytable.component';
import { MyFormComponent }  from '../base/myform.component';
import { MySelectComponent }  from '../base/myselect.component';
import { MyUploaderComponent }  from '../base/myuploader.component';
import { MyLookupComponent }  from '../base/mylookup.component';
import { MyTextEditorComponent }  from '../base/mytexteditor.component';
import { MyCxSelectComponent }  from '../base/mycxselect.component';
import { MyInputComponent }  from '../base/myinput.component';
import { MyTreeComponent }  from '../base/mytree.component';
import { ZxTreeComponent }  from '../base/zxtree.component';
import { MyTreeSelectComponent }  from '../base/mytreeselect.component';
import { MyLabelComponent }  from '../base/mylabel.component';
import { TopbarComponent }  from '../base/topbar.component';

import { DxSelectOptionsDirective }  from '../base/directive/selectoption.directive';


import { PaginationComponent }  from '../base/pagination.component';
import { PageComponent }  from '../base/page.component';
import { PanelHeaderComponent }  from '../portal/panel/panel-header.component';
import { PanelToolbarComponent }  from '../portal/panel/panel-toolbar.component';

import { ValueListDataService } from './valuelist-data.service';
import { ZxTreeService } from './zxtree.service';

@NgModule({
  imports: [
		CommonModule,
		HttpModule,
		JsonpModule,		
		FormsModule,
		ReactiveFormsModule,
		SlimLoadingBarModule.forRoot(),			
		RouterModule
  ],
  exports:[
		MyUploaderComponent,
		MyTextEditorComponent,
		MyCxSelectComponent,
		MySelectComponent,
		MyLabelComponent,
		MyTableComponent,
		MyFormComponent,
		MyLookupComponent,
		MyUploaderComponent,
		MyTextEditorComponent,
		MyInputComponent,
		MyTreeComponent,
		ZxTreeComponent,
		MyTreeSelectComponent,
		TopbarComponent,
		PaginationComponent,
		PageComponent,
		PanelToolbarComponent,
		PanelHeaderComponent,
		DxSelectOptionsDirective,
		SlimLoadingBarModule
  ],
  declarations: [
		MyUploaderComponent,
		MyTextEditorComponent,
		MyCxSelectComponent,
		MySelectComponent,
		MyLabelComponent,
		MyLookupComponent,
		MyTableComponent,
		MyFormComponent,
		MyUploaderComponent,
		MyTextEditorComponent,
		MyInputComponent,
		MyTreeComponent,
		ZxTreeComponent,
		MyTreeSelectComponent,
		TopbarComponent,
		PaginationComponent,
		PageComponent,
		PanelToolbarComponent,
		PanelHeaderComponent,
		DxSelectOptionsDirective
  ],  
  entryComponents:[
		 
  ],
  providers: [ValueListDataService, ZxTreeService]
})
export class AppBaseModule {
  constructor() {
   
  }  
}
