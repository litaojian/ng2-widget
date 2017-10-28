import { Component, ViewChild, ContentChildren, OnInit, AfterViewInit, Injector } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MyTableComponent } from './mytable.component';
import { BaseDataService } from './base-data.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CookieService } from './cookies.service';

export class QueryForm {
  command:string = "search";
}

export class BaseListComponent implements OnInit {
  
  // data table component
  @ViewChild(MyTableComponent) myTable: MyTableComponent;

  queryForm: QueryForm = new QueryForm();

  idField: string = "id";
  // list data
  tableData: Object[] = [];

  pageIndex:number = 1;
  pageSize:number = 10;
  totalCount:number = 0;

  // selected row
  selectedRow: Object = {};
  //parentId:number = 0;
  onloading = false;

  service: BaseDataService;
  activatedRoute: ActivatedRoute;
  router: Router;
  slimLoader:SlimLoadingBarService;

  
  constructor(injector: Injector, service: BaseDataService) {
    this.service = service;
    this.activatedRoute = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.idField = this.service.getIdField();

    //set the view url
    let url = this.router.url;
    this.service.setPageViewUrl(url, "list");
    this.slimLoader = injector.get(SlimLoadingBarService);	

    if (this.activatedRoute.snapshot.queryParams["backto"] == "yes"){
      this.restoreCurrentState();
    }
    
  }


  ngOnInit() {    
    // 初始化查询参数
    //this.queryForm["rolename"] = "test1";
    this.initDefaultQueryParamters();
    // load the tableData
		this.getList("refresh", this.getPageIndex(), this.getPageSize());
  }

  ngAfterViewInit(){

  }

  ngOnDestroy(){
		//console.log("base-list destory");	
  }

  openLink(path:string){
    //console.log(path);
    this.router.navigate([path]);
  }

  onPageLinkClick(pageParam: Object) {
    // 获取最新页码
    this.pageSize = pageParam["pageSize"];
    this.pageIndex = pageParam["pageIndex"];
    let queryParams = {};
    let keys = this.getKeys(this.queryForm)
    for(let i = 0; i < keys.length;i++){
      queryParams[keys[i]] = this.queryForm[keys[i]];
    }

    let pid = this.activatedRoute.snapshot.data["parentId"];
    if (pid != null){
      queryParams["parentId"] = pid;
    }

    this.service.getList("pagelink", queryParams, this.pageIndex, this.pageSize)
      .then(resultData => this.processResult(resultData));
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
    if (this.myTable != null){
      this.myTable.setPageSize(pageSize);
    }
  }
  setPageIndex(index: number) {
    //debugger;
    this.pageIndex = index;
    if (this.myTable != null){
      this.myTable.setPageIndex(index);
    }
  }


  processResult(resultData: Object) {
    //debugger;
    let rows = [];
    let total = 0;
    if (resultData["resultCode"] != null) {
      console.log("API ResultCode:" + resultData["resultCode"] + "," + (resultData["resultMsg"] == null?"":resultData["resultMsg"]));
      rows = resultData["rows"];
      if (resultData["pagination"] != null){
        total = resultData["pagination"]['total'];        
      }
      if (rows == null &&  resultData["resultCode"] == 0){
        rows = JSON.parse(resultData["resultMsg"]);
        if (rows != null){
          total = rows.length;          
        }
      }
    } else if (resultData["data"] != null) {
      rows = resultData["data"];
      total = rows.length;
    }else{
      rows.push(resultData);
    }
    // 
    if (rows == null){
      rows = [];
    }
    this.tableData = rows;
    if (this.tableData == null || this.tableData.length == 0){
      let emptyRow = {};
      //emptyRow[this.service.getIdField()] = "";
      for(let i = 0; i < this.pageSize; i++){
        this.tableData.push(emptyRow);        
      }
    }
    this.totalCount = total;
    if (this.myTable != null){
      this.myTable.setTotalCount(total);
    }
  }

  getListByParams(action: string, params:Object, pageIndex: number, pageSize: number, customUrl?:string): any {
    //debugger;
    this.service.getList(action, params, pageIndex, pageSize, customUrl)
      .then(resultData => this.processResult(resultData));
  }

  initDefaultQueryParamters(){
    let params = {};   
    let formElement = document.getElementById("queryForm");
    if (formElement != null){
      for(let i = 0; i < formElement.children.length; i++){
        let item = formElement.children[i];
        if (item.tagName == 'INPUT'){
          this.parseInputField(item, params);  
          //console.log(item.getAttribute("name") + "=" + item.getAttribute("value"));
        }else if (item.tagName == "DIV"){
          for(let i = 0; i < item.children.length; i++){
            let subItem = item.children[i];
            //console.log(subItem); 
            this.parseInputField(subItem, params);  
          }  
        }
      }  
    }    

    let keys = this.getKeys(params);
    for(let i = 0; i < keys.length;i++){
      this.queryForm[keys[i]] = params[keys[i]];
    }
    return params;
  }

  parseInputField(inputElement, params){
    if (inputElement["tagName"] == 'INPUT'){
      let inputValue = inputElement.getAttribute("value");
      let inputName = inputElement.getAttribute("name");
      let inputType = inputElement.getAttribute("type");        
      if (inputValue != null){
        if (inputValue == "${today}$"){
          let _date:Date = new Date();          
          //console.log("day=" + day);
          inputValue = _date.toLocaleDateString();
          //inputValue = _date.toLocaleString();
        }else if (inputValue == "${beginOfWeek}$"){
          let _date:Date = new Date();
          while (_date.getDay() != 1){
            _date.setDate(_date.getDate() - 1);
          }         
          inputValue = _date.toLocaleDateString();
        }else if (inputValue == "${endOfWeek}$"){
          let _date:Date = new Date();
          //debugger;
          while (_date.getDay() != 0){
            _date.setDate(_date.getDate() + 1);
            //console.log("day:" + _date.getDay());
          }
          inputValue = _date.toLocaleDateString();
        }else if (inputValue == "${loginUserId}$"){
          inputValue = this.service.getLoginId();
        }else if (inputValue.startsWith("${request.") && inputValue.endsWith("}$")){
          let paramKey = inputValue.substring(10, (inputValue.length-2));
          inputValue = this.activatedRoute.snapshot.queryParams[paramKey];
        }
        params[inputName] = inputValue;
      }
    }        

  }
  getDefaultQueryParamters11(){
    let params = {};   
    let formElement = document.getElementById("queryForm");
    if (formElement != null){
      for(let i = 0; i < formElement.children.length; i++){
        let item = formElement.children[i];
        if (item.tagName == 'INPUT'){
          let inputValue = item.getAttribute("value");
          let inputName = item.getAttribute("name");
          let inputType = item.getAttribute("type");        
          if (inputValue != null){
            params[inputName] = inputValue;
          }
          //console.log(item.getAttribute("name") + "=" + item.getAttribute("value"));
        }
      }  
    }
    return params;
  }

  getList(action: string, pageIndex: number, pageSize: number): void {
    //debugger;
    let params = this.queryForm;

    let pid = this.activatedRoute.snapshot.data["parentId"];
    if (pid != null){
      params["parentId"] = pid;
    }
    this.service.getList(action, params, pageIndex, pageSize)
        .then(resultData => this.processResult(resultData));
  }

  onDeleteRow(row: Object): void {
    if (confirm("是否要删除此条数据?")) {
      //debugger;
      this.service.delete(row[this.idField])
        .then(result => {
          console.log("debug:" + JSON.stringify(result));
          if (result == null || result["resultCode"] == 0){
            this.tableData = this.tableData.filter(r => r !== row);
          }else{
            alert(result["resultMsg"] );
          }
        });
    }
  }

  onAddNew(params?:Object): void {
    // 保存返回状态参数
    this.saveCurrentState();

    if (params == null){
      params = {};
    }
    
    let keys = this.getKeys(params);
    for(let i = 0; i < keys.length;i++){
      let paramVal:string = params[keys[i]];
      //console.log("debug:" + keys[i] + "=" + params[keys[i]]);
      if (paramVal.startsWith("${") && paramVal.endsWith("}")){
        let varName = paramVal.replace("${","").replace("}","");
        params[keys[i]] = this.activatedRoute.snapshot.data[varName];
      }
    }
        
    params["backtoUrl"] = this.service.base64Encode(this.router.url);

    let url = this.service.getContextPath(this.router.url) + this.service.getFormViewUrl();
    if (url.endsWith("/edit") || url.endsWith("/view")){
      url = url.substring(0, (url.length -5));
    }    
    this.router.navigate([url, 'create'], {queryParams:params});
  }

  onEditRow(row: Object): void {
    //debugger;
    this.selectedRow = row;
    let url = this.service.getContextPath(this.router.url) + this.service.getFormViewUrl();
    if (url.endsWith("/edit") || url.endsWith("/view")){
      url = url.substring(0, (url.length -5));
    }
    let rowId = this.getValue(row, this.service.getIdField());    
    this.router.navigate([url, 'edit', rowId],{ queryParams: {} });
    //console.log("edit the row:" + row);
  }

  onViewRow(row: Object): void {
    //debugger;
    this.selectedRow = row;
    let url = this.service.getContextPath(this.router.url) + this.service.getFormViewUrl();
    if (url.endsWith("/edit") || url.endsWith("/view")){
      url = url.substring(0, (url.length -5));
    }
    let rowId = this.getValue(row, this.service.getIdField());
    this.router.navigate([url, 'view', rowId],{ queryParams: { } });
    //console.log(" show the row:" + row);
  }

  onQuery(queryParams:QueryForm): void {
    //debugger;
    //console.log("query params:" + JSON.stringify(queryForm));

    this.slimLoader.height = "6px";
    this.slimLoader.start();
    
    if (queryParams == null){
      queryParams = this.queryForm;
    }
    
    // let defaultQueryParams = this.getDefaultQueryParamters();   
    // let keys = this.getKeys(defaultQueryParams);
    // for(let i = 0; i < keys.length;i++){
    //   queryParams[keys[i]] = defaultQueryParams[keys[i]];
    // }

    // pageIndex必须从1开始    
    this.setPageIndex(1);
    this.service.getList("query", queryParams, 1, this.getPageSize())
      .then(resultData => {
        //debugger;
        //setTimeout(()=>{this.slimLoader.complete();},10000);
        this.processResult(resultData)
        this.slimLoader.complete();
      });
      
  }

  onOpenModalDialog(buttonId, row: Object): void {
    //debugger;
    let rowId = this.getValue(row, this.service.getIdField());        
    this.selectedRow = row;
    let url = this.service.getContextPath(this.router.url) + this.service.getFormViewUrl();   
    if (url.endsWith("/edit") || url.endsWith("/view")){
      url = url.substring(0, (url.length - 5));
    }
    //this.router.navigate([{outlets: {let2: url }}]);
    this.router.navigateByUrl(url + "(popup:/dialog/"+ rowId + ")");
    ///(popup:dialog1)
    // this.router.navigate([{outlets: {popup: ['dialog','dialog1']}}]).then(_ => {
    //   // navigation is done
    //   console.log("tttttttttttttttttttttt");
    //  });

    //this.router.navigate([url, 'view', rowId],{ queryParams: { } });

    // let options = {};
    // options["iframe"] = "#/page/admin/role";
    // options["size"] = "fullscreen";  //'lg'，大对话框 'sm'，小对话框 'fullscreen' 全屏
    // options["moveable"] = true;
    // options["showHeader"] = true;
    // let propName = "title";
    // let value = $(buttonId).attr(propName);
    // if (value != null){
    //   options[propName]  = value;
    // }      
    // propName = "dialog-width";
    // value = $(buttonId).attr(propName);
    // if (value != null){
    //   options[propName]  = value;
    // }      
    // propName = "dialog-height";
    // value = $(buttonId).attr(propName);
    // if (value != null){
    //   options[propName]  = value;
    // }      
    // propName = "dialog-size";
    // value = $(buttonId).attr(propName);
    // if (value != null){
    //   options[propName]  = value;
    // }      
    
    // // //弹出对话窗
    // //let myModalTrigger = $.zui.modalTrigger;
    // let myModalTrigger = new $.zui.ModalTrigger(options);    
    // ////let myModalTrigger = $(buttonId).data('zui.modaltrigger');   
    // myModalTrigger.show(options);
    
  }

  getKeys(item){
    return Object.keys(item).sort();
  }

  getValue(item:Object,field:string){
    //debugger;
    let elements = Object.keys(item).sort();
    for(let i = 0; i < elements.length;i++){
      if (field.toLowerCase() == elements[i].toLowerCase()){
        return item[elements[i]];
      }
    }
    return item[field];
  }

  onActionCmdClick(method:string, params:any){	
		// 保存返回状态参数
		this.saveCurrentState();

    this.slimLoader.height = "6px";
    this.slimLoader.start();

    let apiUrl = this.service.getApiUrl() + "/command";
    if (params == null){
      params = {};
    }
    params["command"] = method;
    this.service.callServiceAPI(apiUrl, params)
      .then(resultData => {
        console.log("onActionCmdClick: " + JSON.stringify(resultData));
        if (resultData != null && resultData["resultCode"] == 0){
          let rowData = params["rowdata"];          
          this.getList("refresh", this.getPageIndex(), this.getPageSize());
        }
        //debugger; 
        this.slimLoader.complete();
    });
	}


  onButtonClick(src:string, method:string, params:any){	
		// 保存返回状态参数
		this.saveCurrentState();
		
		//alert("method=" + method);	
    //method = "hello2('ddd')";
    let methodContainer = document.getElementById('commentIframe');
		if (methodContainer == null){
			alert("methodContainer is null");
		}
		//method = decodeURIComponent(method);
		//console.log("method:" + method);
		//this.methodContainer.contentWindow.hello2('hello, ltj');
		if (!method.endsWith(")")){
			method = method + "(" + JSON.stringify(params) + ")";
		}
		eval("this.methodContainer.contentWindow." + method);
	}


  onTreeNodeClick(nodeId){
    //console.log("selected node :" + nodeId);
    this.activatedRoute.snapshot.data['parentId'] = nodeId;
    this.setPageIndex(1);
    this.getList("refresh", this.getPageIndex(), this.getPageSize());
  }

  saveCurrentState(){
    let currentStateParams = {};
    currentStateParams["parentId"] = this.activatedRoute.snapshot.data['parentId']; 
    currentStateParams["pageIndex"] = this.pageIndex; 
    let path = this.router.url.replace(/\//gi, "_");  
    let pos = path.indexOf("?");
    if (pos > 0){
      path = path.substring(0, pos);
    }  
    CookieService.save(path, JSON.stringify(currentStateParams));

  }

  restoreCurrentState(){
    //debugger;
    console.log(this.router.url +  " restoreCurrentState start.....")
    let path = this.router.url.replace(/\//gi, "_");    
    let pos = path.indexOf("?");
    if (pos > 0){
      path = path.substring(0, pos);
    }  
    let value = CookieService.load(path);
    if (value != null){
      let currentStateParams = JSON.parse(value);    
      this.activatedRoute.snapshot.data['parentId'] = currentStateParams["parentId"];
      this.pageSize = currentStateParams["pageSize"];
    }
  }
}  