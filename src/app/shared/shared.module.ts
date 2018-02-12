import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule, NzNotificationService, NzMessageService } from 'ng-zorro-antd';

import { MyAppModule } from '../../../lib/my-app/my-app.module';
import { YgIconModule } from '../../../lib/index';
import { NzSchemaFormModule } from '../../../lib/biz-widget';

const THIRDMODULES = [ 
    NgZorroAntdModule, 
    MyAppModule, 
    YgIconModule
];
// endregion


// region: your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// endregion

@NgModule({  
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        NzSchemaFormModule.forRoot({}),
        ...THIRDMODULES        
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ...THIRDMODULES,
        NzSchemaFormModule,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                // ng-zorro-antd Services
                NzNotificationService,
                NzMessageService,
                
            ]
        };
    }
}
