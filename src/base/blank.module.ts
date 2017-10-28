import { NgModule, Injector, ModuleWithProviders, Type } from '@angular/core';



@NgModule({
  providers: [ ]
})


export class BlankModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BlankModule,
      providers: [
      ]
    };
  }
}