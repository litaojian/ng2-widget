import { NgModule, ModuleWithProviders } from '@angular/core';

import { YgIconModule } from './yg-icon/yg-icon.module';
import { NgxTinymceModule } from './yg-tinymce/tinymce.module';


export * from './yg-icon';
export * from './yg-tinymce';

const MODULES = [
    YgIconModule,
    NgxTinymceModule
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
