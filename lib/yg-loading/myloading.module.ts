import { NgModule, ModuleWithProviders }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MyLoadingComponent }  from './myloading.component';
import { NzSelectModule } from 'ng-zorro-antd';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NzSelectModule,
        ReactiveFormsModule
    ],
    exports:[
        MyLoadingComponent
    ],
    declarations: [
        MyLoadingComponent
    ]
}) 

export class MyLoadingModule {
    constructor() {

    }
}
