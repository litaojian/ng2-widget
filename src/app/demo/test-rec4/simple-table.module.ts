import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { SimpleTableComponent } from './simple-table.component';
import { SimpleTableService } from './simple-table.service';
const routes: Routes = [
    { path: 'index', component: SimpleTableComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [SimpleTableService],
    declarations: [
        SimpleTableComponent
    ],
    exports: [
        RouterModule
    ],
    entryComponents:[]
})
export class SimpleTableModule { }
