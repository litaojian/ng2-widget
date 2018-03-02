import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule, NzNotificationService, NzMessageService } from 'ng-zorro-antd';


import { MyAppModule } from '@yg-widget/my-app/my-app.module';
import { YgIconModule } from '@yg-widget/index';
import { AdSimpleTableModule } from '@yg-widget/biz-table';
import { BizAppModule } from '@yg-widget/biz-app';
import { NzSchemaFormModule, WidgetRegistry, NzWidgetRegistry  } from '@yg-widget/biz-form';

const THIRDMODULES = [ 
    NgZorroAntdModule, 
    YgIconModule,
    BizAppModule   
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
        NzSchemaFormModule.forRoot(),
        AdSimpleTableModule.forRoot(),
        MyAppModule.forRoot(),
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
        AdSimpleTableModule,
        MyAppModule,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    providers:[
        NzNotificationService,
        NzMessageService
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
                { provide: WidgetRegistry, useClass: NzWidgetRegistry },
            ]
        };
    }
}
