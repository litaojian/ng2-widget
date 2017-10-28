import { NgModule, ModuleWithProviders }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


import { environment } from '../environments/environment';
import { BlankModule } from '../base/blank.module';


@NgModule({
  imports: [
    //environment.production?BlankModule.forRoot():InMemoryWebApiModule.forRoot(InMemoryDataService,{apiBase:"api/"})
  ],
  exports:[

  ],
  declarations: [
  ],  
  providers: []
})
export class AppTestModule {
  constructor() {
   
  }  
}
