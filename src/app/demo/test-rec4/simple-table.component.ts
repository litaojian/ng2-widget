import { Component,OnInit } from '@angular/core';
import { SimpleTableColumn } from '@yg-widget/biz-table';
import { NzMessageService } from 'ng-zorro-antd';
import { SimpleTableService } from './simple-table.service';
import {ActivatedRoute} from "@angular/router";
@Component({
    selector: 'app-simple-table',
    templateUrl: './simple-table.component.html'
})
export class SimpleTableComponent{
    // columns:any;
    myUrl:any;
    queryParams:any;
    url:any;
    params:any;
    columns= [
        { 
          title: '号牌号码', 
          index: 'hphm',
          ifFifter:true,
          ifInput:true,
          searchData:{
               hphm:''
          }
        }
    ];

    constructor(
        private msg: NzMessageService,
        private headSearvice:SimpleTableService,
        public _activeRouter: ActivatedRoute
    ) {} 
    ngOnInit() {   
          this._activeRouter.queryParams.subscribe(params=> {
               this.queryParams = params.jsonName;
               if(this.queryParams==undefined){
                   this.myUrl='./assets/json/simple-table1.json';
               }else{
                   this.myUrl='./assets/json/'+this.queryParams+'.json';
               }
               this.getJson(this.myUrl);
               console.log(this.queryParams);
          })
    }
    getJson(url){
         this.headSearvice.getTabelHead(url).subscribe(data => { 
                this.columns=data.rows;
                this.params=data.params;
                this.url=data.url;
                console.log(this.columns);
          });
    }
}
