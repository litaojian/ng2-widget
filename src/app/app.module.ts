import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ReuseTabService } from '@delon/abc';
import { StartupService } from './startup.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OtherComponent } from './other/other.component';


export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OtherComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
        { path: 'admin/org',  loadChildren: './demo/biz-org/biz-org.module#BizOrganiztionModule'},
        { path: 'testRec',  loadChildren: './demo/test-rec/testRec.module#TestRecModule'},
        { path: 'testRec2', loadChildren: './demo/test-rec2/testRec2.module#TestRec2Module'},
        { path: 'testRec3', loadChildren: './demo/test-rec3/testRec3.module#TestRec3Module'},
        { path: 'testRec4', loadChildren: './demo/test-rec4/simple-table.module#SimpleTableModule'},
        { path: 'page',     loadChildren: './my-bizpage.module#MyBizPageModule'},        
        { path: 'home', component: HomeComponent },
        { path: 'other', component: OtherComponent },
        { path: '', redirectTo: 'page/admin/permission/list', pathMatch: 'full'}
    ], { useHash: true })
    
  ],
  providers: [
    StartupService,
    //{ provide: LOCALE_ID, useValue: 'zh-Hans' },
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    },
    ReuseTabService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
