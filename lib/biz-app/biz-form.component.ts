import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '..//biz-form';
import { BizFormService } from './biz-form.service';
import { FormComponent } from '../biz-form';
import { ReuseTabService } from '@delon/abc';

@Component({
    selector: 'app-biz-form',
    template: `
        <my-simple-form #myMainForm [layout]="mainForm.layout"
            [schema]="mainForm.schema"
            [model]="mainForm.model"
            [actions]="actions">
        </my-simple-form>
    `,
    providers:[BizFormService]
})
export class BizFormComponent implements OnInit {

    @ViewChild('myMainForm')
    myMainForm:FormComponent;

    activatedRoute: ActivatedRoute;
    router: Router;
    bizService:BizFormService;
    msgService: NzMessageService;
    reuseTabService:ReuseTabService;

    isNew: boolean = true;
    isReadOnly: boolean = false;
    pagePath:string;

    actions:any = {
        backto: (form: any) => {
            this.goBack();
        },
        save: (form: any) => {
            this.onSubmitAction(form.value);
            //console.log(JSON.stringify(form.value));
            //this.msg.success(JSON.stringify(form.value));                       
        }      
    };

    mainForm:any = {
        layout:"horizontal",
        schema: null,
        model: {}
    };


    constructor(injector: Injector) {
        this.msgService = injector.get(NzMessageService);
        this.bizService = injector.get(BizFormService);
        this.reuseTabService = injector.get(ReuseTabService);

        this.activatedRoute = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        //
        console.log("BizFormComponent init ..............");
    }

    ngOnInit() {           
        //     
        this.pagePath = "#" + this.router.url;
		
        let len = this.activatedRoute.snapshot.url.length;
        let dir, pageName="nosetting", cmd;

        dir = this.activatedRoute.snapshot.url[0].path;		
		if (len > 1){
            pageName = this.activatedRoute.snapshot.url[1].path;
        }
        if (len > 2){
            cmd = this.activatedRoute.snapshot.url[2].path;		
        }
			
		if (len >= 4){
			//this.parentId = +this.activatedRoute.snapshot.url[3].path;			
		}		
        if (dir){
            dir = "demo";
        }        
        if (pageName){
            pageName = "testRec";
        }
        this.bizService.ajaxGet(`assets/pages/${dir}/${pageName}.json`, {}).subscribe(
            resultData => {
                this.processLoadPageDef(resultData);
                this.processLoadFormData();
            } 
            
        );	
    }
    //     
    processLoadPageDef(resultData:any){
        
        if (this.reuseTabService){
            this.reuseTabService.title = resultData["title"];
        }

        if (resultData["mainForm"]){
            this.mainForm.schema = {};
            this.mainForm.layout = resultData["mainForm"].layout || "horizontal";
            Object.keys(resultData["mainForm"]).forEach((propKey:string) => {
                this.mainForm.schema[propKey] = resultData["mainForm"][propKey];                
            });    
        }

        Object.keys(resultData["actions"]).forEach((propKey:string) => {
            this.actions[propKey] = resultData["actions"][propKey];
        });

        this.bizService.setApiUrl(resultData.restAPI);
        this.bizService.setIdField(resultData.idField);
        //set the view url
        this.bizService.setPageViewUrl(this.router.url, "form");

        //console.log("page def:" , this.queryForm);
    }
    
    processLoadFormData() {

        if (this.router.url.indexOf("/view/") > 0){
          this.isReadOnly = true;
        }
        if (this.router.url.indexOf("/create") > 0){
          this.isNew = true;
        }
        // 预载入值列表
        //this.valuelist = this.service.loadValueListData();
    
        // 根据参数读取指定记录
        let rowId = this.activatedRoute.snapshot.params['id'];
        let queryParams = this.activatedRoute.snapshot.queryParams;    
        if (!rowId){
          rowId = queryParams['id'];
        }
        if (rowId){
            this.bizService.getDetail(rowId).subscribe( (resultData:any) =>{
    
                let tmpData = resultData["data"];
                if (tmpData == null) {
                  tmpData = resultData["rowData"];
                }
                //debugger;
                if (tmpData != null) {
                   if (tmpData instanceof Array){
                    this.mainForm.model = tmpData[0];
                   }else{
                    this.mainForm.model  = tmpData;
                   }
                   this.isNew = false;          
                } else {
                  
                  let keys = Object.keys(queryParams);
                  for(let i = 0; i < keys.length;i++){
                    //let paramVal:string = queryParams[keys[i]];
                    //console.log("debug:" + keys[i] + "=" + queryParams[keys[i]]);
                    this.mainForm.model[keys[i]] = queryParams[keys[i]];
                  }          
                  //console.log(this.formData);
                  
                }
            });    
        }
      }


  onSubmitAction(formData:any): void {
    //debugger;
    if (this.isNew) {
      //console.log(this.formData)
      this.bizService.create(formData)
        .subscribe((result:any)  => {
          //debugger;
          if (result == null && this.bizService.getIsTest()) {
            this.goBack();
            return;
          }
          if (result != null && result["resultCode"] == 0) {
            alert("新增操作:" + result["resultMsg"]);
            this.goBack();
          } else {
            // alert(result["resultMsg"]);
            alert("新增操作失败:" + result["resultMsg"]);
            //this.goBack();
          }

        });

    } else {
      this.bizService.update(formData)
        .subscribe((result:any) => {
          console.log(JSON.stringify(result));
          //debugger;
          if (result == null && this.bizService.getIsTest()) {
            this.goBack();
            return;
          }
          if (result != null && result["resultCode"] == 0) {
            alert(result["resultMsg"]);
            this.goBack();
          } else {
            alert(result["resultMsg"]);
          }
        });
    }

  }

  goBack(): void {
    //debugger;
    let url:string = this.bizService.base64Decode(this.activatedRoute.snapshot.queryParams["backtoUrl"]);

    if (url == null){
      url = this.bizService.getContextPath(this.router.url) + this.bizService.getListViewUrl();
      //console.log("current path=" + url);
      let len = url.split("/").length;
      if (len >3 && !url.endsWith("/list")){
        url = url.substring(0, url.lastIndexOf("/"));
      }else {
        url = url;
      }
    }
    let _queryParams:any = {};
    let splitIndex =  url.indexOf("?");
    if (splitIndex > 0){
      let queryString = url.substring(splitIndex+1);      
      //console.log("queryString:" + queryString);
      _queryParams = this.bizService.parseUrlParams(queryString);
      _queryParams["backto"] = "yes";   
      url = url.substring(0, splitIndex);
      
    }else{
      _queryParams["backto"] = "yes";
    }
    
    console.log("backto url:" + url);
    this.router.navigate([url],{queryParams:_queryParams});
  }

  goPage(url:string): void {
    this.router.navigate([url]);
  }


}
