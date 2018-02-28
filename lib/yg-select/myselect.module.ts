import { NgModule, ModuleWithProviders }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NzSelect2Component }  from './my-select2.component';
import { SelectService } from './my-select2.service';
import { NzSelectModule } from 'ng-zorro-antd';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NzSelectModule,
        ReactiveFormsModule
    ],
    exports:[
        NzSelect2Component
    ],
    declarations: [
        NzSelect2Component
    ],
    providers: [
         SelectService
    ]
}) 

export class MySelectModule {
    constructor() {

    }
}
