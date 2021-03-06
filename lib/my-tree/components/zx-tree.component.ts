import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute, Params } from '@angular/router';
import { ZxTreeService } from './zx-tree.service';
declare const $: any;

@Component({
	selector: 'zx-tree',
	template: `
			<ul [id]="treeId" class="ztree" style="display:block;" data-ride="tree">
            </ul>
			`,
	inputs: [],
	outputs: [],
	providers:[ZxTreeService]
})

export class ZxTreeComponent implements OnInit, AfterViewInit, AfterViewChecked {

	@Input('tree-id')
	public treeId: string;
	
	@Input('key-id')
	public idKey: string = "nid";

	@Input('key-pid')
	public pidKey: string = "parentid";
	
	@Input('key-title')
	public titleKey: string = "title";

	@Input('has-checkbox')
	public hasCheckbox: string = "false";

	@Input('source')
	public treeDataSource: string;

	@Output('nodeClick') 
	nodeClickEvent = new EventEmitter<any>();

	pagePath:string;
	
	constructor(_renderer: Renderer, _elementRef: ElementRef, private ztreeService: ZxTreeService,  private activatedRoute: ActivatedRoute, private router: Router) {
		//console.log("MyTreeComponent init:");
		this.pagePath = "#" + this.router.url;	
		//
		console.log("ZxTreeComponent...............");	
	}

	ngOnInit() {
		
		let _parent = this;
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: "assets/jquery/ztree/css/zTreeStyle/zTreeStyle.css" }).appendTo("head");
		$("<script>").attr({ src: "assets/jquery/ztree/js/jquery.ztree.core.js" }).appendTo("head");
		$("<script>").attr({ src: "assets/jquery/ztree/js/jquery.ztree.excheck.js" }).appendTo("head");
		//console.log("name=" + this.name + ", dataSource=" + this.optionDataSource);

		this.loadTree(this.treeDataSource);			
	}
	
	ngAfterViewChecked() {
		let _pagePath = "#" + this.router.url;
		if (this.pagePath != _pagePath){
			this.ztreeService.clearCache();
		}
		//console.log("bizQuery afterViewChecked " + this.pagePath);
	}	
	ngAfterViewInit() {

	}

	fireMyEvent(evt: any) {
		//this.submitEvent.next(['abc','def']);
	}

	loadTree(config:any){
		let settings:any = this.ztreeService.getDefaultOptions();
		if (config && ("true" == config.checkbox || config.checkbox == true)) {
		  settings["check"]["enable"] = true;		  
		}  
		if (this.nodeClickEvent){
			settings["nodeClickEvent"] = this.nodeClickEvent;
		}
		//debugger;
		settings["treeId"] = this.treeId;
		
		if (config && config.dataUrl){
			if (config && ("true" == config.checkbox || config.checkbox == true)) {
				config.dataUrl = config.dataUrl + "&checkbox=yes&roleId=" + config.roleId;		  
			} 
			settings["treeDataSource"] = config.dataUrl;
			this.treeDataSource = config.dataUrl;
		}
		settings["data"]["key"]["name"] = this.titleKey;
		settings["data"]["simpleData"]["pidKey"] = this.pidKey;
		settings["data"]["simpleData"]["idKey"] = this.idKey;
		let selectNodeId = this.activatedRoute.snapshot.queryParams["parentId"];      
		this.ztreeService.initZtree(settings, selectNodeId);  
	}

	getSelectedNodes(){
		let nodeData = this.ztreeService.getSelectedNodes(this.treeId);
		return nodeData;
	}
	
}

