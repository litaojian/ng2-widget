import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { BizQueryComponent } from './biz-query.component';
import { BizQueryService } from './biz-query.service';
import { BizFormComponent } from './biz-form.component';
import { BizFormService } from './biz-form.service';
//import { PageContainerComponent } from './page.container.component';

import { BizQueryDialogComponent, BizFormDialogComponent } from './biz-dialog.component';
import { BizDialogService } from './biz-dialog.service';

const routes: Routes = [{
  path: '',
  //component: PageContainerComponent,
  children: [
    { path: 'test/dialog/:id', component: BizQueryComponent },        
    { path: ':dir/:pageName/list', component: BizQueryComponent },    
    { path: ':dir/:pageName/list/:pid', component: BizQueryComponent },        
    { path: ':dir/:pageName/create', component: BizFormComponent },     
    { path: ':dir/:pageName/edit/:id', component: BizFormComponent },     
    { path: ':dir/:pageName/view/:id', component: BizFormComponent }, 
    { path: ':dir/:pageName', redirectTo: ':dir/:pageName/list', pathMatch: 'full' },  
    { path: '', redirectTo: 'bizquery/index', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BizQueryDialogComponent,
    BizQueryComponent,
    BizFormComponent
  ],
  entryComponents:[
    BizQueryDialogComponent,
    BizFormDialogComponent
  ],
  providers: [BizQueryService, BizFormService, BizDialogService]
})
export class BizPageModule { }
