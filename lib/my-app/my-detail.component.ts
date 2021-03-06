import { Component, Injector, ViewChild, EventEmitter, Input, Output, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReuseTabService } from '@delon/abc';

import { DataObject, BaseDataService } from '../base/base-data.service';

export class BaseDetailComponent implements OnInit {

  formGroup: FormGroup;
  formBuilder: FormBuilder

  formData: DataObject = new DataObject();
  isNew: boolean = true;
  isReadOnly: boolean = false;
  isDialog: boolean = false;

  reuseTabService:ReuseTabService;
  service: BaseDataService;
  activatedRoute: ActivatedRoute;
  router: Router;
  location: Location;

  // valuelist data
  valuelist:Object = {};

  constructor(
    injector: Injector,
    service: BaseDataService
  ) {
    //
    console.log("BaseDetailComponent init .....................");

    this.service = service;
    this.activatedRoute = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.location = injector.get(Location);
    //
    this.reuseTabService = injector.get(ReuseTabService);

    this.formBuilder = injector.get(FormBuilder);    
    this.formGroup = this.formBuilder.group({});
    
    //set the view url
    let url = this.router.url;
    this.service.setPageViewUrl(url, "form");

    // 设置页标题
    let queryParams = this.activatedRoute.snapshot.queryParams;  
    if (this.reuseTabService && queryParams['title']){
      this.activatedRoute.snapshot.data.reuseTitle = queryParams['title'] + "-详情";      
    }else{
      this.reuseTabService.title = "未设置-详情";
    }
  }

  ngOnInit() {

    if (this.router.url.indexOf("/view/") > 0){
      this.isReadOnly = true;
    }
    if (this.router.url.indexOf("/create") > 0){
      this.isNew = true;
    }
    // 预载入值列表
    this.valuelist = this.service.loadValueListData();

    // 根据参数读取指定记录
    let rowId = this.activatedRoute.snapshot.params['id'];
    let queryParams = this.activatedRoute.snapshot.queryParams;    
    if (!rowId){
      rowId = queryParams['id'];
    }
    
    if (rowId){
      this.service.getDetail(rowId).subscribe( (resultData:any) =>{

        let tmpData = resultData["data"];
        if (tmpData == null) {
          tmpData = resultData["rowData"];
        }
        //debugger;
        if (tmpData != null) {
           if (tmpData instanceof Array){
            this.formData = tmpData[0];
           }else{
            this.formData = tmpData;
           }
           this.isNew = false;          
        } else {
          
          let keys = this.getKeys(queryParams);
          for(let i = 0; i < keys.length;i++){
            //let paramVal:string = queryParams[keys[i]];
            //console.log("debug:" + keys[i] + "=" + queryParams[keys[i]]);
            this.formData[keys[i]] = queryParams[keys[i]];
          }          
          //console.log(this.formData);
          
        }
      });
    }
    // this.activatedRoute.params
    //   // (+) converts string 'id' to a number
    //   .switchMap((params: Params) => this.service.getDetail(+params['id']))
    //   .subscribe((resultData: Object) => {
    //     //console.log("get Detail responseJSON =" + JSON.stringify(resultData));

    //     let tmpData = resultData["data"];
    //     if (tmpData == null) {
    //       tmpData = resultData["rowData"];
    //     }
    //     //debugger;
    //     if (tmpData != null) {
    //        if (tmpData instanceof Array){
    //         this.formData = tmpData[0];
    //        }else{
    //         this.formData = tmpData;
    //        }
    //        this.isNew = false;          
    //     } else {
          
    //       let keys = this.getKeys(queryParams);
    //       for(let i = 0; i < keys.length;i++){
    //         //let paramVal:string = queryParams[keys[i]];
    //         //console.log("debug:" + keys[i] + "=" + queryParams[keys[i]]);
    //         this.formData[keys[i]] = queryParams[keys[i]];
    //       }          
    //       //console.log(this.formData);
          
    //     }
    //   });

  }

  onSubmitBtnClick(): void {
    //debugger;
    if (this.isNew) {
      //console.log(this.formData)
      this.service.create(this.formData)
        .subscribe((result:any)  => {
          //debugger;
          if (result == null && this.service.getIsTest()) {
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
      this.service.update(this.formData)
        .subscribe((result:any) => {
          console.log(JSON.stringify(result));
          //debugger;
          if (result == null && this.service.getIsTest()) {
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
    let url:string = this.service.base64Decode(this.activatedRoute.snapshot.queryParams["backtoUrl"]);

    if (url == null){
      url = this.service.getContextPath(this.router.url) + this.service.getListViewUrl();
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
      _queryParams = this.service.parseUrlParams(queryString);
      _queryParams["backto"] = "yes";   
      url = url.substring(0, splitIndex);
      
    }else{
      _queryParams["backto"] = "yes";
    }
    //console.log("backto url:" + url);
    this.router.navigate([url],{queryParams:_queryParams});
  }

  goPage(url:string): void {
    this.router.navigate([url]);
  }

	onCommandBtnClick(cmd:string, params:Object){
    alert(cmd + ":" + JSON.stringify(params));
		// this.service.executeCmd(cmd, params)
    //     .then(result => {
    //       console.log(JSON.stringify(result));
    //       //debugger;          
    //       if (result != null && result["resultCode"] == 0) {
    //         alert(result["resultMsg"]);
    //       } else {
    //         alert(result["resultMsg"]);
    //       }
    //     });
	}

  getKeys(item:Object){
    return Object.keys(item).sort();
  }


}
