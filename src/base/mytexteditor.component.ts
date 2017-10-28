import { Component, Directive, EventEmitter, Optional, Input, Output, OnInit, AfterViewInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { DefaultValueAccessor, ControlValueAccessor, NgControl, NgModel } from '@angular/forms';


declare var KindEditor: any;

@Component({
	selector: 'my-texteditor',
	template: `
		 <textarea [class]="styleClass + ' formControl kindeditor'" rows="3" type="text" [name]="fieldName">{{model.value}}</textarea>
	`,
	inputs:[]
})



export class MyTextEditorComponent extends DefaultValueAccessor implements OnInit, AfterViewInit {

	@Input("class")
	styleClass:string ="";

	@Input("name")
	fieldName:string;

	@Input('url') uploadApiUrl: string;

	private editor: any;

	constructor(private el: ElementRef, private renderer2: Renderer2, public model: NgModel, @Optional() ngControl: NgControl) {
		super(renderer2, el, false);
		//renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'red');
		if (ngControl) {
			ngControl.valueAccessor = this;
		}
	}

	ngOnInit() {
       //this.model.control.registerOnChange(this.setValueToEditor);
	   
	}

	writeValue(value: any): void{
		//console.log("writeValue..............." + this.model.value + ",value=" + value);
		if (this.editor != null){
			this.editor.html(value);	
		}	 
	}

	ngAfterViewInit() {
		let _self = this;
		//富文本编辑器
		this.editor = KindEditor.create('textarea.kindeditor', {
			basePath: 'assets/kindeditor/',
			allowFileManager: true,
			uploadJson: "/ZxFiles/cms/WebResourceManager/upload",
			fileManagerJson: "/ZxFiles/cms/WebResourceManager/upload",
			afterBlur: function () { _self.valueSync() },
			bodyClass: 'article-content'
		});

	}


	ngAfterViewChecked() {
		
	}


	valueSync(){
		
		 console.log("valueSync:" + JSON.stringify(this.model.value));
		
		 if (this.editor != null){
		 	console.log("htmlEditor.value=" + this.editor.html());	
		 	if  (this.model != null){
		 		this.model.reset(this.editor.html());
		 	}
		 }

	}


}
