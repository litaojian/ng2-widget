import { Component, Optional, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, Renderer, Renderer2 } from '@angular/core';
import { DefaultValueAccessor, ControlValueAccessor, NgModel, NgControl } from '@angular/forms';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'my-lookup',
	//moduleId: module.id,
	template: `
		<div class="input-group" style="width:380px">
            <input type="text" [name]=this.id [value]="model.value==undefined?'':model.value" class="form-control" >
            <div class="input-group-btn">
                <button type="button"  class="btn btn-default dropdown-toggle" data-toggle="dropdown">选项 <span class="caret"></span></button>
                <div id="menuContent" class="menuContent dropdown-menu" style="position: absolute;">
					<ul id="treeDemo{{model.name}}" class="ztree" style="margin-top:0; width:180px; height: 300px;"></ul>
				</div>
            </div>
		</div>
		`,
	styles: [''],
	inputs: ['placeholder', 'formControl'],
	outputs: [],
	providers: []
})



export class MyLookupComponent extends DefaultValueAccessor implements OnInit {
	resultMap: Object[] = [];
	id: any;
	pId: any;
	mc: any;

	@Input()
	public name: string;

	@Input()
	public placeholder: string = null;

	@Input()
	public readonly: boolean = false;

	@Input()
	public disabled: boolean;

	@Input("isChenkBox")
	public isChenkBox: boolean;

	@Input('source')
	public optionDataSource: string;

	@Input('options')
	public options: string;

	@Input('class')
	public styleClass: string;

	constructor(_renderer2: Renderer2, _elementRef: ElementRef, private http: Http, public model: NgModel, @Optional() ngControl: NgControl) {
		super(_renderer2, _elementRef, false);
		if (ngControl) {
			ngControl.valueAccessor = this;
		}

	}

	mapped() {
		debugger;
		let value = this.options;
		let val = eval('(' + value + ')');

		console.dir(this);
		if (value) {
			this.id = val["id"];
			this.pId = val["pId"];
			this.mc = val["name"];
		} else {
			this.id = "id";
			this.pId = "pId";
			this.mc = "name";
		}

	}
	getName() {
		return this.mc;
	}

	getJsonDataFromService(dataUrl: string) {
		//debugger;
		console.log("---------------------" + dataUrl)
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.http.get(dataUrl, options)
			.map((res: Response) => res.json())
			.do(result => {
				//debugger;
				console.log("debug1:" + JSON.stringify(result));
			});
	}

	ngOnInit() {
		debugger;
		let yy = this;
		this.mapped();

		if (this.optionDataSource != null) {
			$("<link>").attr({ rel: "stylesheet", type: "text/css", href: "/theme/default/demo.css" }).appendTo("head");
			$("<link>").attr({ rel: "stylesheet", type: "text/css", href: "/theme/default/zTreeStyle/zTreeStyle.css" }).appendTo("head");
			$("<script>").attr({ src: "/assets/js/jquery.ztree.core.js" }).appendTo("head");
			$("<script>").attr({ src: "/assets/js/jquery.ztree.excheck.js" }).appendTo("head");
			let url = this.optionDataSource;
			url = url.replace("/api/", "/remote/api/rest/");
			url = url + '/list';
			this.getJsonDataFromService(url).subscribe(result => {
				debugger;
				var setting = {
					check: {},
					view: {
						dblClickExpand: true,
						showIcon: true,
					},
					data: {
						simpleData: {
							enable: true,
							idKey: this.id,
							pIdKey: this.pId,
							rootPid: null
						},
						key: {
							name: this.mc
						},
					},

					callback: {
						onClick: onClick,
						onCheck: onCheck
					}
				};
				if (yy.isChenkBox) {
					setting.check = { enable: true, radioType: "level" }
					setting.view.showIcon = false;
				}

				var zNodes = result.rows;

				function onClick(e, treeId, treeNode) {
					var zTree = $.fn.zTree.getZTreeObj("treeDemo" + yy.model.name);
					if (treeNode.isParent) {
						if (treeNode.open) {
							treeNode.open = false;
							zTree.refresh();
							e.stopPropagation();
						} else {
							treeNode.open = true;
							zTree.refresh();
							e.stopPropagation();
						}
					} else {
						if (yy.isChenkBox) { e.stopPropagation() }
						else {
							yy.model.reset(treeNode.name);
						}
					}
					zTree.checkNode(treeNode, !treeNode.checked, null, true);
					return false;
				}

				function onCheck(e, treeId, treeNode) {
					debugger;
					var zTree = $.fn.zTree.getZTreeObj("treeDemo" + yy.model.name),
						nodes = zTree.getCheckedNodes(true),
						v = "";
					for (var i = 0, l = nodes.length; i < l; i++) {

						v += nodes[i][yy.mc] + ",";
					}
					if (v.length > 0) v = v.substring(0, v.length - 1);

					yy.model.reset(v);
				}
				$.fn.zTree.init($("#treeDemo" + yy.model.name), setting, zNodes);
			});
		}

	}

	writeValue(value: any): void {
		debugger;
		let yy = this;
		if (yy.model.value) {
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo" + yy.model.name);
			for (let i of yy.model.value.split(",")) {
				var node = treeObj.getNodeByParam(yy.mc, i, null);
				node.checked = "checked";
				treeObj.updateNode(node);
			}

		}
	}

	ngAfterViewInit() {
		// alert($("#duoxuan").val())
	}


}
