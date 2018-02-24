import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { TestRec3ListComponent } from './testRec3.component';
import { TestRec31ListComponent } from './testRec31.component';
import { TestRec32ListComponent } from './testRec32.component';
import { TestRecService } from '../test-rec/testRec.service';
import { SimpleTableDemoComponent } from '../basic/simple.table.component';


const routes: Routes = [
  { path: 'index', component: TestRec3ListComponent},
  { path: '31', component: TestRec31ListComponent},  
  { path: '32', component: TestRec32ListComponent},    
  { path: 'table', component: SimpleTableDemoComponent},  
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
    TestRec3ListComponent,
    TestRec31ListComponent,
    TestRec32ListComponent,
    SimpleTableDemoComponent
  ],
  providers: [TestRecService]
})


export class TestRec3Module { }
