
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from './shared/shared.module';
import { BizPageComponent, BizQueryComponent, BizQueryService,BizFormComponent, BizFormService, BizTreeTableComponent, BizPageGuardService } from '@yg-widget/biz-app';

//import { BizQueryComponent, BizQueryService } from '@yg-widget/my-app';
//import { BizFormComponent, BizFormService } from '@yg-widget/my-app';
//import { HelloService } from './shared/hello.service';


const routes: Routes = [{
  path: '',
  //component: PageContainerComponent,
  children: [    
    { path: ':type/:dir/:pageName/list', component: BizPageComponent, canActivate:[BizPageGuardService]},
    { path: ':dir/:pageName/tree', component: BizTreeTableComponent, canActivate:[BizPageGuardService] },    
    { path: ':dir/:pageName/list', component: BizQueryComponent, canActivate:[BizPageGuardService] },    
    { path: ':dir/:pageName/list/:pid', component: BizQueryComponent, canActivate:[BizPageGuardService] },        
    { path: ':dir/:pageName/create', component: BizFormComponent },     
    { path: ':dir/:pageName/edit', component: BizFormComponent },     
    { path: ':dir/:pageName/view', component: BizFormComponent }, 

    { path: ':dir/:pageName', redirectTo: ':dir/:pageName/list', pathMatch: 'full' },  
    { path: 'test/dialog/:id', component: BizQueryComponent },        
    { path: '', redirectTo: 'admin/organization/tree', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
  ],
  entryComponents:[
  ],
  providers: []
})
export class MyBizPageModule {

}
