import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { TestRec3ListComponent } from './testRec3.component';
import { TestRecService } from '../test-rec/testRec.service';



const routes: Routes = [
  { path: 'index', component: TestRec3ListComponent},
  { path: '/', redirectTo: 'index', pathMatch: 'full' },
  { path: '', redirectTo: 'index', pathMatch: 'full' }  
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
    TestRec3ListComponent
  ],
  providers: [TestRecService]
})

export class TestRec3Module { }
