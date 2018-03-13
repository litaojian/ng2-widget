import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TreeModule } from 'angular-tree-component';

import { MyTreeComponent } from './components/my-tree.component';

export { MyTreeOptions } from './components/my-tree.options';
export { MyTreeComponent } from './components/my-tree.component';

@NgModule({
    imports: [CommonModule, TreeModule],
    declarations: [MyTreeComponent],
    exports: [MyTreeComponent]
})
export class MyTreeModule { }
