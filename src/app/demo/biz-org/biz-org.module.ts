import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';


import { BizOrganizationComponent } from './biz-org.component';
import { TestRecService } from '../test-rec/testRec.service';


const routes: Routes = [
  { path: 'index', component: BizOrganizationComponent},
  { path: '/', redirectTo: '', pathMatch: 'full' },
  { path: '', redirectTo: '32', pathMatch: 'full' }  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    BizOrganizationComponent
  ],
  providers: [TestRecService]
})


export class BizOrganiztionModule { }
