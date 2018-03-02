import { Component, Injector,Inject, Input, Output, OnDestroy, OnInit, OnChanges, SimpleChanges, EventEmitter, Renderer2, ElementRef, TemplateRef, SimpleChange, QueryList, ViewChildren, AfterViewInit, ContentChildren, ContentChild, Optional } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { _HttpClient, CNCurrencyPipe, MomentDatePipe, YNPipe, ModalHelper, ALAIN_I18N_TOKEN, AlainI18NService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { tap, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { SimpleTableColumn, SimpleTableChange, CompareFn, SimpleTableSelection, SimpleTableFilter, SimpleTableData, SimpleTableButton, STExportOptions, ResReNameType } from './interface';
import { SimpleTableConfig } from './simple-table.config';
import { deepGet, deepCopy } from '../utils/utils';
import { SimpleTableRowDirective } from './simple-table-row.directive';
import { SimpleTableExport } from './simple-table-export';
import { SimpleTableFifterComponent } from './simple-table-fifter.component';
import { SimpleTableComponent } from './simple-table.component';
import { NzModalService } from 'ng-zorro-antd';
declare var $: any;
@Component({
    selector: 'my-simple-table',
    templateUrl: './my-simple-table.component.html',
    styleUrls: [ './simple-table.less' ],
    providers: [ SimpleTableExport, CNCurrencyPipe, MomentDatePipe, YNPipe, DecimalPipe,SimpleTableConfig ]
})
// export class SimpleTableComponent implements OnInit{

   
//     constructor(
//         injector: Injector,
//         @Optional() private acl: ACLService,
//         @Optional() @Inject(ALAIN_I18N_TOKEN) private i18nSrv: AlainI18NService
//     ) {
       
//     }

//    OnInit(){

//    }
export class MySimpleTableComponent extends SimpleTableComponent  implements OnInit {
  
    constructor(
        Injector:Injector,
        @Optional() acl: ACLService,
        @Optional() @Inject(ALAIN_I18N_TOKEN) i18nSrv: AlainI18NService
    ) {
          super(Injector,acl,i18nSrv);
    }
    ngOnInit() {

    }
    inputFiltered:any;
    timeFiltered:any[]=[];//时间数据存放
    title:any;
    num:any;//判断点击哪个
    showModalForComponent(c:any,index:any) {
        this.num=index;
        if(c.ifInput==true){
           this.title='input';
        }else if(c.ifSelect==true){
           this.title='select';
        }else if(c.ifTime==true){
           this.title='time';
        }
        const subscription = this.modalService.open({
        title          : '条件查询',
        content        : SimpleTableFifterComponent,
        onOk() {
        },
        onCancel() {
            console.log('Click cancel');
        },
        footer         : false,
        componentParams: {
            name: this.title,
            placeHolder:c.title,
            selectUrl:c.selectUrl
        }
        });
        subscription.subscribe(result => {
           if(typeof result=='object'){
             console.log(result);
             if(result.input!=undefined){
                this.inputFiltered=result;
             }else{
                this.timeFiltered=result;
             }
             
             this.myHandleFilter(this._columns);
           }
           
        })
   }
    myHandleFilter(col:any){
        console.log(col);
        if(this.timeFiltered.length>0){
            for(let i in col[this.num].searchData){
                for(let j=0;j<this.timeFiltered.length;j++){
                    col[this.num].searchData[i]=this.timeFiltered[j];
                    console.log(col[this.num].searchData[i]);
                }
            } 
        }else{
            for(let i in col[this.num].searchData){
                for(let j in this.inputFiltered){
                    if(this.inputFiltered[j]!=''){
                        col[this.num].searchData[i]=this.inputFiltered[j];
                    }     
                }     
            } 
        }
        this.extraParams=$.extend({},this.extraParams,col[this.num].searchData);
        this._genAjax(true);
        this._genData(true);
        this.filterChange.emit(col);
    }
    

}