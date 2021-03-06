import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, ViewChild, HostBinding, Injector } from '@angular/core';
import { SimpleChanges, OnDestroy, OnInit, DoCheck } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '..//biz-form';
import { BizFormService } from './biz-form.service';
import { BizPageComponent } from './biz-page.component';
import { FormComponent } from '../biz-form';
import { ReuseTabService } from '@delon/abc';

@Component({
    selector: 'app-biz-form',
    template: `
    <div class="content__title" style="display: none;">
      <h1>
        {{pageTitle}}
      </h1>
    </div>
    <nz-card [nzBordered]="false" [nzNoHovering]="true">
      <ng-template #body>
        <my-simple-form #myMainForm [layout]="mainForm.layout"
            [schema]="mainForm.schema"
            [model]="mainForm.model"
            [actions]="actions">
        </my-simple-form>
      </ng-template>
    </nz-card>    
    `,
    providers:[BizFormService]
})
export class BizFormComponent extends BizPageComponent implements OnInit, DoCheck {

    @ViewChild('myMainForm')
    myMainForm:FormComponent;

    isNew: boolean = true;
    isReadOnly: boolean = false;
    pagePath:string;
    rowId:any;

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
        super(injector);
        //
        //console.log("BizFormComponent init ..............");
    }
    //     
    onPageInit(resultData:any, url:string){
        
        if (this.reuseTabService){
          this.pageTitle  =  resultData["title"] + "-详情";
          this.reuseTabService.title = this.pageTitle;
        }

        if (resultData["mainForm"]){
            this.mainForm.schema = {};
            this.mainForm.layout = resultData["mainForm"].layout || "horizontal";
            Object.keys(resultData["mainForm"]).forEach((propKey:string) => {
                this.mainForm.schema[propKey] = resultData["mainForm"][propKey];                
            });
            if (resultData["mainForm"]["model"] != null){
              this.mainForm.model = resultData["mainForm"]["model"];
              delete this.mainForm.schema.model;
            }    
        }

        Object.keys(resultData["actions"]).forEach((propKey:string) => {
            this.actions[propKey] = resultData["actions"][propKey];
        });

        this.bizService.setApiUrl(resultData.restAPI);
        this.bizService.setIdField(resultData.idField);
        //set the view url
        this.bizService.setPageViewUrl(this.router.url, "form");

        //console.log("page def:" , this.queryForm);

        this.processLoadFormData();
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
        this.rowId = this.activatedRoute.snapshot.params['id'];
        let queryParams = this.activatedRoute.snapshot.queryParams;    
        if (!this.rowId){
          this.rowId = queryParams['id'];
        }
        
        if (this.rowId){
            this.bizService.getDetail(this.rowId).subscribe( (resultData:any) =>{
    
                let tmpData = resultData["data"];
                if (tmpData == null) {
                  tmpData = resultData["rowData"];
                }
                //debugger;
                if (tmpData != null) {
                   if (tmpData instanceof Array){
                    //this.mainForm.model = tmpData[0];
                    Object.keys(tmpData[0]).forEach((propKey:string) => {
                      this.mainForm.model[propKey] = tmpData[0][propKey];                
                    });
                   }else{
                    //this.mainForm.model  = tmpData;
                    Object.keys(tmpData).forEach((propKey:string) => {
                      this.mainForm.model[propKey] = tmpData[propKey];                
                    });
                   }
                   // 标志为编辑状态
                   this.isNew = false;          
                } else {                  
                  let keys = Object.keys(queryParams);
                  for(let i = 0; i < keys.length;i++){
                    //let paramVal:string = queryParams[keys[i]];
                    //console.log("debug:" + keys[i] + "=" + queryParams[keys[i]]);
                    this.mainForm.model[keys[i]] = queryParams[keys[i]];
                  }
                }
                // 刷新表单数据
                this.myMainForm.refreshSchema();
            });    
        }else{
          // 添加新记录
          let keys = Object.keys(queryParams);
          for(let i = 0; i < keys.length;i++){
            this.mainForm.model[keys[i]] = queryParams[keys[i]];
          }
          this.myMainForm.refreshSchema();    
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
      //
      formData[this.bizService.getIdField()] = this.rowId;
      
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
      if (len > 4 && !url.endsWith("/list")){
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
