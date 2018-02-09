import { Component, Directive, Optional, EventEmitter, Input, Output, OnInit, AfterViewInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { DefaultValueAccessor, ControlValueAccessor, NgControl, NgModel, FormControl } from '@angular/forms';



@Component({
	selector: 'my-uploader',
	template: `
			<img class="picSzie" src="{{model.value==undefined?'':model.value}}" />
			<div class="uploader">
                 <div class="file-list" data-drag-placeholder="请拖拽文件到此处"></div>
				 <div class="aaaa">
                 <input class="form-control xiaoba" type="text" [name]="fieldName" [value]="model.value==undefined?'':model.value" [placeholder]="placeholder" />
                 <button type="button" class="btn btn-primary uploader-btn-browse"><i class="icon icon-cloud-upload"></i>本地图片</button>
				 </div>
		    </div>
			`,
	styles: ['.file-list{display:none;}','.xiaoba{ width:auto;float:left;display:none;}',
	'.uploader-btn-browse{ width:93px}', '.aaaa{width:100%}','.picSzie{width:150px;}'],  
	inputs:[]
})



export class MyUploaderComponent extends DefaultValueAccessor implements OnInit, AfterViewInit {

	@Input("name")
	fieldName:string;

	@Input("placeholder")
	placeholder:string = "图片";

	constructor(private el: ElementRef, private renderer2: Renderer2, public model: NgModel, @Optional() ngControl: NgControl) {
		super(renderer2, el, false);

		if (ngControl) {
			ngControl.valueAccessor = this;
		}
	}
	getModelValue(){
		return this.model.value;
	}
	ngOnInit() {
		let yy = this;
		$(".uploader").uploader({
			autoUpload: true,            // 当选择文件后立即自动进行上传操作
			//url: "http://192.168.2.174:8080/ZxFiles/cms/WebResourceManager/upload?dataType=JSON",
			url: 'ZxFiles/cms/WebResourceManager/upload?dataType=JSON',
			onFileUploaded: function (file, responseObject) {
				var obj = eval('(' + responseObject.response + ')');
				yy.model.reset(obj.url);

			}
		});
	}

	writeValue(value: any): void{
		super.writeValue(value);
	}


	ngAfterViewInit() {
		let _self = this;

	}

}
