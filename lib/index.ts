import { NgModule, ModuleWithProviders } from '@angular/core';

import { YgIconModule } from './yg-icon/yg-icon.module';
import { YgTinymceModule } from './yg-tinymce/tinymce.module';
import { MyAppModule } from './my-app/my-app.module';



export * from './yg-icon';
export * from './yg-tinymce';
export * from './my-app';


const MODULES = [
    MyAppModule,
    YgIconModule,
    YgTinymceModule
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
