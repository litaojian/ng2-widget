import { NgModule, ModuleWithProviders } from '@angular/core';

import { YgIconModule } from './yg-icon/yg-icon.module';
import { YgTinymceModule } from './yg-tinymce/tinymce.module';
//import { MyAppModule } from './my-app/my-app.module';
import { AdSimpleTableModule } from './biz-table/simple-table.module';



export * from './yg-icon';
export * from './yg-tinymce';
export * from './my-app';
export * from './biz-table';


const MODULES = [
    //MyAppModule,
    YgIconModule,
    YgTinymceModule,
    AdSimpleTableModule
];

@NgModule({
    imports: MODULES,
    exports: MODULES
})
export class YgWidgetRootModule {
}

@NgModule({ exports: MODULES })
export class YgWidgetModule {
    public static forRoot(): ModuleWithProviders {
        return { ngModule: YgWidgetRootModule };
    }
}
