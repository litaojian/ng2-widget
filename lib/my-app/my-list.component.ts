import { Component, ViewChild, ContentChildren, OnInit, AfterViewInit, Injector } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BaseDataService } from '../base/base-data.service';
import { ExtCookieService } from '../base/ext-cookies.service';

export class QueryForm {
  command: string = "search";
}

export class BaseListComponent implements OnInit, AfterViewInit {

  queryForm: QueryForm = new QueryForm();

  idField: string = "id";
  // list data
  tableData: Object[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  // selected row
  selectedRow: Object = {};

  // multi-check
  allChecked = false;
  indeterminate = false;
  selectedRows: Object[] = [];
  curRows: any[] = [];
  sortMap: any = {};

  //parentId:number = 0;
  onloading = false;

  // valuelist data
  valuelist:Object = {};

  service: BaseDataService;

  activatedRoute: ActivatedRoute;
  router: Router;
  userFunctionJS: string;

  constructor(injector: Injector, service: BaseDataService) {
    this.service = service;
    this.activatedRoute = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.idField = this.service.getIdField();

    //this.messageService = injector.get(NzMessageService);
    //this.modalService = injector.get(NzModalService);

    //set the view url
    let url = this.router.url;
    this.service.setPageViewUrl(url, "list");
    //this.slimLoader = injector.get(SlimLoadingBarService);

  }

  ngOnInit() {
    console.log("base-list onInit..........");
    // load the all valuelist
    this.valuelist = this.service.loadValueListData();

    // 初始化查询参数
    this.initDefaultQueryParamters();

  }

  ngAfterViewInit() {
    if (this.userFunctionJS) {
      this.loadScript(this.userFunctionJS);
    } else {
      console.log("userFunctionJS=" + this.userFunctionJS);
    }

    // load the tableData
    this.getList("refresh", this.getPageIndex(), this.getPageSize());

  }

  loadScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      console.log("loadScript:" + scriptUrl);
      const scriptElement = document.createElement('script')
      scriptElement.src = scriptUrl
      scriptElement.onload = resolve
      document.body.appendChild(scriptElement)
    })
  }

  ngOnDestroy() {
    //console.log("base-list destory");
  }

  openLink(path: string) {
    //console.log(path);
    this.router.navigate([path]);
  }

  onPageLinkClick(pageParam: Object) {
    // 获取最新页码
    if (pageParam["pageSize"]){
      this.pageSize = pageParam["pageSize"];
    }
    if (pageParam["pageIndex"]){
      this.pageIndex = pageParam["pageIndex"];
    }else{
      this.pageIndex = <number>pageParam;
    }

    let queryParams = {};
    let keys = this.getKeys(this.queryForm)
    for (let i = 0; i < keys.length; i++) {
      queryParams[keys[i]] = this.queryForm[keys[i]];
    }

    let pid = this.activatedRoute.snapshot.data["parentId"];
    if (pid != null) {
      queryParams["parentId"] = pid;
    }

    this.service.getList("pagelink", queryParams, this.pageIndex, this.pageSize)
      .subscribe(resultData => this.processResult(resultData));
    //this.getList("pagelink", this.getPageIndex(), this.getPageSize());
    //console.log("MyListComponent goPage:" + cmd);
  }

  goPageUrl(url): void {
    this.router.navigateByUrl(url);
  }

  getPageIndex() {
    return this.pageIndex;
  }

  getPageSize() {
    return this.pageSize;
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
  }
  setPageIndex(index: number) {
    //debugger;
    this.pageIndex = index;
  }


  processResult(resultData: Object) {
    //debugger;
    let rows = [];
    let total = 0;
    let _pageSize = this.pageSize;
    if (resultData["resultCode"] != null) {
      console.log("API ResultCode:" + resultData["resultCode"] + "," + (resultData["resultMsg"] == null ? "" : resultData["resultMsg"]));
      rows = resultData["rows"];
      if (resultData["pagination"] != null) {
        total = resultData["pagination"]['total'];
        _pageSize = resultData["pagination"]['pageSize'];
      }
      if (rows == null && resultData["resultCode"] == 0) {
        rows = JSON.parse(resultData["resultMsg"]);
        if (rows != null) {
          total = rows.length;
        }
      }
    } else if (resultData["data"] != null) {
      rows = resultData["data"];
      total = rows.length;
    } else {
      rows.push(resultData);
    }
    //
    if (rows == null) {
      rows = [];
    }
    this.pageSize = _pageSize;
    this.tableData = rows;
    this.curRows = rows;
    if (this.tableData == null || this.tableData.length == 0) {
      let emptyRow = {};
      //emptyRow[this.service.getIdField()] = "";
      for (let i = 0; i < this.pageSize; i++) {
        this.tableData.push(emptyRow);
      }
    }
    this.totalCount = total;
  }

  getListByParams(action: string, params: Object, pageIndex: number, pageSize: number, customUrl?: string): any {
    //debugger;
    this.service.getList(action, params, pageIndex, pageSize, customUrl)
      .subscribe(resultData => this.processResult(resultData));
  }

  initDefaultQueryParamters() {
    //
    if (this.activatedRoute.snapshot.queryParams["backto"] == "yes") {
      this.restoreCurrentState();
    }
  }

  getList(action: string, pageIndex: number, pageSize: number): void {
    //debugger;
    let params = JSON.parse(JSON.stringify(this.queryForm));

    let pid = this.activatedRoute.snapshot.data["parentId"];
    if (pid != null) {
      params["parentId"] = pid;
    }
    if ( params["pageSize"] != null && params["pageSize"] > 0) {
      pageSize = params["pageSize"];
    }

    this.service.getList(action, params, pageIndex, pageSize)
      .subscribe(resultData => this.processResult(resultData));
  }


  onDeleteRow(row: Object): void {
    if (confirm("是否要删除此条数据?")) {
      //debugger;
      this.service.delete(row[this.idField])
        .subscribe(result => {
          console.log("debug:" + JSON.stringify(result));
          if (result == null || result["resultCode"] == 0) {
            this.tableData = this.tableData.filter(r => r !== row);
          } else {
            alert(result["resultMsg"]);
          }
        });
    }
  }

  onAddNew(params?: Object): void {
    // 保存返回状态参数
    this.saveCurrentState();

    if (params == null) {
      params = {};
    }

    let keys = this.getKeys(params);
    for (let i = 0; i < keys.length; i++) {
      let paramVal: string = params[keys[i]];
      //console.log("debug:" + keys[i] + "=" + params[keys[i]]);
      if (paramVal.startsWith("${") && paramVal.endsWith("}")) {
        let varName = paramVal.replace("${", "").replace("}", "");
        params[keys[i]] = this.activatedRoute.snapshot.data[varName];
      }
    }

    params["backtoUrl"] = this.service.base64Encode(this.router.url);
    let url = this.getUrl(this.service.getContextPath(this.router.url) + this.service.getFormViewUrl());
    this.router.navigate([url, 'create'], { queryParams: params });
  }

  onEditRow(row: Object): void {
    // debugger;
    this.selectedRow = row;
    let url = this.getUrl(this.service.getContextPath(this.router.url) + this.service.getFormViewUrl());
    let rowId = this.getValue(row, this.service.getIdField());
    this.router.navigate([url, 'edit'], { queryParams: {'id':rowId} });
    //console.log("edit the row:" + row);
  }

  onViewRow(row: Object): void {
    //debugger;
    this.selectedRow = row;
    let url = this.getUrl(this.service.getContextPath(this.router.url) + this.service.getFormViewUrl());
    let rowId = this.getValue(row, this.service.getIdField());
    this.router.navigate([url, 'view'], { queryParams: {'id':rowId} });
    //console.log(" show the row:" + row);
  }


	getUrl(url:string){
		let pos = url.lastIndexOf("?");
        if (pos > 0){
            url = url.substring(0, pos);
        }
        if (url.endsWith("/create")){
            url = url.substring(0, url.length -7);
        }else if ( url.endsWith("/edit")){
            url = url.substring(0, url.length - 5);
        }else if ( url.endsWith("/view")){
            url = url.substring(0, url.length -5);
        }
        return url;
  }

  onQueryFormSubmit(form: any): void {
    // debugger;
    let fieldNames = this.getKeys(this.queryForm);
    let controlValue, inputValue, inputType, inputName;
    let fieldValues = {};

    // for (var i = 0; i < fieldNames.length; i++) {
    //   inputType = $("input[name='" + fieldNames[i] + "']").attr("data-type");
    //   inputName = $("input[name='" + fieldNames[i] + "']").attr("name");
    //   inputValue = $("input[name='" + fieldNames[i] + "']").val();
    //   if (inputType != null && inputName != null){
    //     fieldValues[fieldNames[i]] = inputValue;
    //   }else{
    //     fieldValues[fieldNames[i]] = this.queryForm[fieldNames[i]];
    //   }
    //   // inputValue = $("input[name='" + fieldNames[i] + "']").val();
    //   // if (form.controls[fieldNames[i]]) {
    //   //   controlValue = form.controls[fieldNames[i]].value;
    //   // } else {
    //   //   controlValue = null;
    //   // }
    //   // //console.log("ngForm input field(" + fieldNames[i] + ") :" + inputValue, + "vs" + controlValue);
    //   // if (inputValue != null && inputValue != controlValue) {
    //   //   let fieldValue = {};
    //   //   fieldValue[fieldNames[i]] = inputValue;
    //   //   if (form.controls[fieldNames[i]]) {
    //   //     form.controls[fieldNames[i]].setValue(inputValue);
    //   //   }
    //   // }
    // }

    console.log("ng form:" + JSON.stringify(form.value));
    //let tmp = form.controls.rolename;
    //tmp.updateValueAndValidity();

    this.onQuery(fieldValues);
    //let rawValue = tmp.getRawValue();
    //console.log("rawValue:" + rawValue);

  }
  onFormFieldInput(): void {
    let fieldNames = this.getKeys(this.queryForm);
    for (var i = 0; i < fieldNames.length; i++) {
      //console.log("ngForm input field :" + $("input[name='" + fieldNames[i] + "']").val());
    }

  }
  //
  onQuery(queryParams: Object): void {
    //debugger;
    console.log("in query params:" + JSON.stringify(queryParams));
    // store status
    this.saveCurrentState();

    //this.slimLoader.height = "6px";
    //this.slimLoader.start();

    // let defaultQueryParams = this.getDefaultQueryParamters();
    // let keys = this.getKeys(defaultQueryParams);
    // for(let i = 0; i < keys.length;i++){
    //   queryParams[keys[i]] = defaultQueryParams[keys[i]];
    // }

    // pageIndex必须从1开始
    this.setPageIndex(1);
    this.service.getList("query", queryParams, 1, this.getPageSize())
      .subscribe(resultData => {
        //debugger;
        //setTimeout(()=>{this.slimLoader.complete();},10000);
        this.processResult(resultData)
        //this.slimLoader.complete();
      });

  }

  getKeys(item) {
    return Object.keys(item).sort();
  }

  getValue(item: Object, field: string) {
    //debugger;
    let elements = Object.keys(item).sort();
    for (let i = 0; i < elements.length; i++) {
      if (field.toLowerCase() == elements[i].toLowerCase()) {
        return item[elements[i]];
      }
    }
    return item[field];
  }

  onActionCmdClick(method: string, params: any) {
    // 保存返回状态参数
    this.saveCurrentState();

    //this.slimLoader.height = "6px";
    //this.slimLoader.start();

    let apiUrl = this.service.getApiUrl() + "/command";
    if (params == null) {
      params = {};
    }
    params["command"] = method;
    this.service.callServiceAPI(apiUrl, params)
      .do(resultData => {
        console.log("onActionCmdClick: " + JSON.stringify(resultData));
        if (resultData != null && resultData["resultCode"] == 0) {
          let rowData = params["rowdata"];
          this.getList("refresh", this.getPageIndex(), this.getPageSize());
        }
        //debugger;
        //this.slimLoader.complete();
      });
  }


  onButtonClick(src: string, method: string, params: any) {
    // 保存返回状态参数
    this.saveCurrentState();

    //alert("method=" + method);
    //method = "hello2('ddd')";
    let methodContainer = document.getElementById('commentIframe');
    if (methodContainer == null) {
      alert("methodContainer is null");
    }
    //method = decodeURIComponent(method);
    //console.log("method:" + method);
    //this.methodContainer.contentWindow.hello2('hello, ltj');
    if (!method.endsWith(")")) {
      method = method + "(" + JSON.stringify(params) + ")";
    }
    eval("this.methodContainer.contentWindow." + method);
  }


  onTreeNodeClick(nodeId) {
    //console.log("selected node :" + nodeId);
    this.activatedRoute.snapshot.data['parentId'] = nodeId;
    this.setPageIndex(1);
    this.getList("refresh", this.getPageIndex(), this.getPageSize());
  }

  saveCurrentState() {
    let currentStateParams = {};
    currentStateParams["parentId"] = this.activatedRoute.snapshot.data['parentId'];
    currentStateParams["pageIndex"] = this.pageIndex;
    currentStateParams["queryForm"] = this.queryForm;

    let path = this.router.url.replace(/\//gi, "_");
    let pos = path.indexOf("?");
    if (pos > 0) {
      path = path.substring(0, pos);
    }
    ExtCookieService.save(path, JSON.stringify(currentStateParams));

  }

  restoreCurrentState() {
    //debugger;
    console.log(this.router.url + " restoreCurrentState start.....")
    let path = this.router.url.replace(/\//gi, "_");
    let pos = path.indexOf("?");
    if (pos > 0) {
      path = path.substring(0, pos);
    }
    let value = ExtCookieService.load(path);
    if (value != null) {
      let currentStateParams = JSON.parse(value);
      this.activatedRoute.snapshot.data['parentId'] = currentStateParams["parentId"];
      this.pageSize = currentStateParams["pageSize"];
      this.queryForm = currentStateParams["queryForm"];
    }
  }


  refreshStatus() {
    const allChecked = this.curRows.every(value => value.disabled || value.checked);
    const allUnChecked = this.curRows.every(value => value.disabled || !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.selectedRows = this.tableData.filter(value => value['checked']);
    //this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
  }

  clear() {
    this.selectedRows = [];
    this.tableData.forEach(row => row['checked'] = false);
    this.refreshStatus();
  }

  checkAll(value: boolean) {
    this.curRows.forEach(i => {
      if (!i.disabled) i.checked = value;
    });
    this.refreshStatus();
  }

	// getValueList(typename:string){
	// 	console.log("getValueList async.........." + typename);
	// 	if (!this.valuelist[typename]){
	// 		this.service.getValueList(typename).subscribe(result =>{
	// 			this.valuelist[typename] = result;
	// 		});
	// 	}
	// 	return this.valuelist[typename];
	// }

}
