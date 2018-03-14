import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TreeModule } from 'angular-tree-component';

import { MyTreeComponent } from './components/my-tree.component';
import { ZxTreeComponent } from './components/zx-tree.component';

// export 
export { MyTreeOptions } from './components/my-tree.options';
export { MyTreeComponent } from './components/my-tree.component';
export { ZxTreeComponent } from './components/zx-tree.component';

@NgModule({
    imports: [CommonModule, TreeModule],
    declarations: [MyTreeComponent, ZxTreeComponent],
    exports: [MyTreeComponent, ZxTreeComponent]
})
export class MyTreeModule { }
