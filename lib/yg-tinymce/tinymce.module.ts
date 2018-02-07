import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TinymceOptions } from './tinymce.options';
import { TinymceComponent } from './tinymce.component';
import { ScriptService } from './script.service';

// region: export

export * from './tinymce.options';
export { TinymceComponent } from './tinymce.component';

// endregion

@NgModule({
    imports: [CommonModule],
    declarations: [TinymceComponent],
    exports: [TinymceComponent]
})
export class NgxTinymceModule {
    public static forRoot(options: TinymceOptions): ModuleWithProviders {
        return {
            ngModule: NgxTinymceModule,
            providers: [
                ScriptService,
                { provide: TinymceOptions, useValue: options }
            ]
        };
    }
}
