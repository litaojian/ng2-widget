import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MySelectModule } from '../yg-select/myselect.module';
import { SimpleTableComponent } from './simple-table.component';
import { MySimpleTableComponent } from './my-simple-table.component';
import { SimpleTableRowDirective } from './simple-table-row.directive';
import { SimpleTableConfig } from './simple-table.config';
import { SimpleTableFifterComponent } from './simple-table-fifter.component';
const COMPONENTS = [SimpleTableComponent,MySimpleTableComponent,SimpleTableRowDirective];

// region: zorro modules

import { NzDatePickerModule,NzButtonModule,NzPopoverModule,NzInputModule,NzTableModule, NzCheckboxModule, NzRadioModule, NzDropDownModule, NzMenuModule, NzPopconfirmModule } from 'ng-zorro-antd';

const ZORROMODULES = [ NzDatePickerModule,NzButtonModule,NzPopoverModule,NzInputModule,NzTableModule, NzCheckboxModule, NzRadioModule, NzDropDownModule, NzMenuModule, NzPopconfirmModule,MySelectModule];

// endregion

@NgModule({
    imports:        [CommonModule, FormsModule, ...ZORROMODULES],
    declarations:   [...COMPONENTS,SimpleTableFifterComponent],
    exports:        [...COMPONENTS],
    entryComponents:[SimpleTableFifterComponent]
})
export class BizSimpleTableModule {
    static forRoot(): ModuleWithProviders {
        return { ngModule: BizSimpleTableModule, providers: [ SimpleTableConfig ] };
    }
}
