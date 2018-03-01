import { Component,OnInit } from '@angular/core';
import { SimpleTableColumn } from '@delon/abc';
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
    // : SimpleTableColumn[] 
    // url = `analysis/api/analysis/first/appear/list`;
    // params = { 
    //            ksfxsj: "2016-08-01 14:42:30",
    //            jsfxsj: "2016-08-10 14:42:24",
    //            fxfw:   "430100000001,430100000002",
    //            hssj:12
    //          };
    // total = 100;
    
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
                   this.myUrl='./assets/json/'+this.queryParams;
               }
               this.getJson(this.myUrl);
               console.log(this.queryParams);
          })
        //   this.headSearvice.getTabelHead(this.myUrl).subscribe(data => { 
        //         this.columns=data.rows;
        //         this.params=data.params;
        //         this.url=data.url;
        //         console.log(this.columns);
        //   });
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
