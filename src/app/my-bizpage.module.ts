import { BizPageModule } from '../../lib/my-app/biz-page.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { BizQueryComponent, BizQueryService } from '@yg-widget';
import { BizFormComponent, BizFormService } from '@yg-widget';
import { HelloService } from '@shared/hello.service';
//import { HelloService } from './shared/hello.service';


const routes: Routes = [];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BizQueryComponent,
    BizFormComponent
  ],
  entryComponents:[

  ],
  providers: [BizQueryService, BizFormService]
})

export class MyBizPageModule extends BizPageModule {

}
