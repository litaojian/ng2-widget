import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute, Params } from '@angular/router';
import { ZxTreeService } from './zxtree.service';

@Component({
	selector: 'zx-tree',
	template: `
			<ul [id]="treeId" class="ztree" style="display:block;" data-ride="tree">
            </ul>
			`,
	inputs: [],
	outputs: []
})

export class ZxTreeComponent implements OnInit, AfterViewInit {

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

	constructor(_renderer: Renderer, _elementRef: ElementRef, private ztreeService: ZxTreeService,  private activatedRoute: ActivatedRoute) {
		//console.log("MyTreeComponent init:");
	}

	ngOnInit() {
		
		let _parent = this;
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: "theme/default/zTreeStyle/zTreeStyle.css" }).appendTo("head");
		$("<script>").attr({ src: "assets/jquery/ztree/js/jquery.ztree.core.js" }).appendTo("head");
		$("<script>").attr({ src: "assets/jquery/ztree/js/jquery.ztree.excheck.js" }).appendTo("head");
		//console.log("name=" + this.name + ", dataSource=" + this.optionDataSource);

		let settings = this.ztreeService.getDefaultOptions();
		if ("true" == this.hasCheckbox) {
		  settings["check"]["enable"] = true;
		}  
		settings["treeId"] = this.treeId;
		settings["treeDataSource"] = this.treeDataSource;
		settings["data"]["key"]["name"] = this.titleKey;
		settings["data"]["simpleData"]["pidKey"] = this.pidKey;
		settings["data"]["simpleData"]["idKey"] = this.idKey;
	
		this.ztreeService.nodeClickEvent = this.nodeClickEvent;
		//
		let selectNodeId = this.activatedRoute.snapshot.queryParams["parentId"];      
		this.ztreeService.initZtree(settings, selectNodeId);  	

	}
	
	ngAfterViewInit() {

	}

	fireMyEvent(evt: any) {
		//this.submitEvent.next(['abc','def']);
	}
}

