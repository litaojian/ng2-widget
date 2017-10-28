import { Component, OnInit, Input, Output, ViewChild, ElementRef, HostListener, EventEmitter, Renderer2, Optional} from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute, Params } from '@angular/router';
import { ControlValueAccessor, DefaultValueAccessor, NgControl, NgModel} from '@angular/forms';
import { ZxTreeService, TreeNodeClickEventCallback } from './zxtree.service';

@Component({
  selector: 'my-tree-select',
  template: `
  <div class="input-group">
    <input type="text" class="form-control" [value]="text" readOnly="true" [placeholder]="placeholder">
    <input type="hidden" [name]="fieldName" [value]="model.value">
    <div class="input-group-btn">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
      <div class="dropdown-menu pull-right" role="menu">
        <ul [id]="treeId" class="ztree " data-ride="tree">      
        </ul>      
      </div>
      
    </div>
  </div>
      `,
  styles:[
    `
      .ztree{
          display:block;
          min-width:150px;
          width:230px;
      }
    `
  ],
  animations: [
  ]
})

export class MyTreeSelectComponent extends DefaultValueAccessor implements OnInit, ControlValueAccessor, TreeNodeClickEventCallback {

  @Input("name")
  fieldName:string;
  
  @Input("placeholder")
  placeholder:string;
 
  @Input('tree-id')
  public treeId: string = "treeSelect1";

  @Input('key-id')
	public idKey: string = "nid";

	@Input('key-pid')
	public pidKey: string = "parentid";
	
	@Input('key-title')
	public titleKey: string = "title";

	@Input('has-checkbox')
  public hasCheckbox: string = "true";
  
  @Input('source')
	public treeDataSource: string;

  @Input()
  public data: any;

  @Input()
  public options: any;

  text: string = "";
  
    
	@Output('nodeClick') 
	nodeClickEvent = new EventEmitter<any>();


  constructor(private el: ElementRef, private renderer2: Renderer2, 
    public model: NgModel, 
    @Optional() ngControl: NgControl,
    private ztreeService: ZxTreeService,  
    private activatedRoute: ActivatedRoute
  ) {
		super(renderer2, el, false);
		if (ngControl) {
			ngControl.valueAccessor = this;
		}
  }
  

  ngOnInit() {

      let element = this.el.nativeElement;

      $(".dropdown").dropdown();

      let _parent = this;
      $("<link>").attr({ rel: "stylesheet", type: "text/css", href: "theme/default/zTreeStyle/zTreeStyle.css" }).appendTo("head");
      $("<script>").attr({ src: "assets/jquery/ztree/js/jquery.ztree.core.js" }).appendTo("head");
      $("<script>").attr({ src: "assets/jquery/ztree/js/jquery.ztree.excheck.js" }).appendTo("head");
      //console.log("name=" + this.name + ", dataSource=" + this.optionDataSource);
  
      let settings = this.ztreeService.getDefaultOptions();
      if ("true" == this.hasCheckbox) {
        settings["check"]["enable"] = true;
      }
      
      if (element.getAttribute('multiple') == null || element.getAttribute('multiple') == "false") {
        //settings.check.radioType = "all";        
        settings["check"]["chkStyle"] = "radio";        
        settings["check"]["radioType"] = "all";
      }else{
        settings["check"]["chkStyle"] = "checkbox";                
      }

      settings["treeId"] = this.treeId;
      settings["treeDataSource"] = this.treeDataSource;
      settings["data"]["key"]["name"] = this.titleKey;
      settings["data"]["simpleData"]["pidKey"] = this.pidKey;
      settings["data"]["simpleData"]["idKey"] = this.idKey;      
      
      this.ztreeService.nodeClickEvent = this.nodeClickEvent;
      this.ztreeService.setNodeCheckEventCallback(this);
      //
      let selectNodeId = this.activatedRoute.snapshot.queryParams["parentId"];      
      this.ztreeService.initZtree(settings, selectNodeId);      

  }

  onNodeEvent(event, treeId, treeNode){
    //console.log("event.type = " +event.type);
    if (event.type == 'ztree_check'){
      this.model.reset(treeNode["nodeId"]);            
      this.text = treeNode["name"];      
    }
    return false;
  }

  fireNodeClickEvent(href:string){
		//debugger;
		//console.log(JSON.stringify(event));
		let nodeId = href.slice(1);		
  }  

  writeValue(value: any) {
    //debugger;
    let _parent = this;
    if (value) {
      super.writeValue(value);
      this.ztreeService.getTreeData(this.treeDataSource).then(
				treeData => {
          //debugger;	
          let treeNode = _parent.ztreeService.findNodeById(treeData, this.idKey, value);
          if (treeNode != null){
            _parent.text = treeNode[this.titleKey];            
          }
				}
      );      
      if (this.text == null || this.text == ""){
        this.text = value;
      }
    }
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any) {}

  _onChange = (value: any) => {};

  private _loadFiles() {
    if (!$('#ztreeFile-3').length) {
      $('<link>').attr({ id: 'ztreeFile-1', rel: "stylesheet", type: "text/css", href: "/assets/jquery/ztree/css/zTreeStyle/zTreeStyle.css" }).appendTo("head");
      $('<script>').attr({ id: 'ztreeFile-2', src: "/assets/jquery/ztree/js/jquery.ztree.all.min.js" }).appendTo("head");
      $('<script>').attr({ id: 'ztreeFile-3', src: "/assets/jquery/ztree/js/jquery.ztree.exhide.min.js" }).appendTo("head");
    }
  }



  @HostListener('click', ['$event'])
  click(event) {    
    //console.log("debug ltj: " + event.type + ", event.target:" + event.target);
    if (event.target.nodeName == "SPAN" && event.type == "click" && event.target.id.endsWith("_check")) {
      event.stopPropagation(); // 禁止冒泡      
      return;
    }

  }  
}