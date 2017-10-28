import { Component, Directive, Optional, EventEmitter, Input, Output, OnInit, AfterViewInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { DefaultValueAccessor, ControlValueAccessor, NgControl, NgModel, FormControl } from '@angular/forms';



@Component({
	selector: 'my-input',
	template: `
		 <input [class]="styleClass + ' formControl kindeditor'" rows="3" type="text" [name]="fieldName" [value]="model.value" />
	`,
	inputs:[]
})



export class MyInputComponent extends DefaultValueAccessor implements OnInit, AfterViewInit {

	@Input("class")
	styleClass:string ="";

	@Input("name")
	fieldName:string;

	@Output() output = new EventEmitter();
	
	private fieldValue:string = "";

	constructor(private el: ElementRef, private renderer2: Renderer2, public model: NgModel, @Optional() ngControl: NgControl) {
		super(renderer2, el, false);
		if (ngControl) {
			ngControl.valueAccessor = this;
		}
	}

	ngOnInit() {
		
	}

	writeValue(value: any): void{
		//debugger;
		//console.log("write value:" + value);
		super.writeValue(value);
	}


	ngAfterViewInit() {
		let _self = this;

	}

}
