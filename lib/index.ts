import { NgModule, ModuleWithProviders } from '@angular/core';

import { YgIconModule } from './yg-icon/yg-icon.module';
import { YgTinymceModule } from './yg-tinymce/tinymce.module';
//import { MyAppModule } from './my-app/my-app.module';
import { AdSimpleTableModule } from './biz-table/simple-table.module';
import { MySelectModule } from './yg-select/myselect.module';
import { MyLoadingModule } from './yg-loading/myloading.module';
// import { MyChooseIconModule } from './yg-treeselect/chooseIcon.module';

export * from './yg-icon';
export * from './yg-tinymce';
export * from './my-app';
export * from './biz-table';
export * from './yg-select';
export * from './yg-loading';
// export * from './yg-treeselect';


const MODULES = [
    //MyAppModule,
    YgIconModule,
    YgTinymceModule,
    AdSimpleTableModule,
    MySelectModule,
    MyLoadingModule,
    // MyChooseIconModule
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
