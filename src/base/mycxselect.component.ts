import { Component, Directive, Optional, EventEmitter, Input, Output, OnInit, AfterViewInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { DefaultValueAccessor, ControlValueAccessor, NgControl, NgModel, FormControl } from '@angular/forms';
import { AppService } from '../app/app.service';


@Component({
	selector: 'my-cxSelect',
	template: `
			<div [id]="fieldId" *ngFor="let sselect of sselects; let i = index;">
				<div class="col-sm-{{nDivle}}">
                     <select [id]="fieldId+sselect+'id'" (change)="selectChange($event,i)" class="form-control {{sselect}}" data-first-title="请选择"></select>
				</div>
           </div>
			`,
	styles: [''],  //.province{display:none;}
	inputs: []
})



export class MyCxSelectComponent extends DefaultValueAccessor implements OnInit, AfterViewInit {

	@Input("id")
	private fieldId: string;

	@Input("name")
	private fieldName: string;

	@Input('source')
	public optionDataSource: string;

	@Input('selects')
	public optionSelects: string;

	@Input('class')
	public styleClass: string;

	@Input("placeholder")
	private placeholder: string = "请选择";
	sselects: string[] = [];
	ss: string[] = [];
	nDivle: number;

	constructor(private el: ElementRef, private renderer2: Renderer2, private model: NgModel, @Optional() ngControl: NgControl,
		private appService: AppService) {
		super(renderer2, el, false);

		if (ngControl) {
			ngControl.valueAccessor = this;
		}

	}

	ngOnInit() {
		$("<script>").attr({ src: "/assets/jquery/cxselect/jquery.cxselect.js" }).appendTo("head");
		// this.appService.getJsonDataFromService(this.optionDataSource).subscribe(result => {
		// })
		if (this.optionSelects) {
			this.ss = this.optionSelects.split(",")
			for (let i of this.ss) {
				this.sselects.push(i.split("=")[0])
			}
			this.nDivle = Math.round(8/(this.sselects.length))
		}
		
	}

	writeValue(value: any): void {
		if (value) {
			var cxSelectApi;
			cxSelectApi = $.cxSelect($('#' + this.fieldId), {
				selects: this.sselects
			});
			
			for (let i=0; i<this.ss.length; i++) {
				if(this.ss[i].indexOf("=")>-1){
					$('#' + this.fieldId + this.sselects[i] + 'id').attr("data-value", this.ss[i].split("=")[1])
				}else
					$('#' + this.fieldId + this.sselects[i] + 'id').attr("data-value", value.split(",")[i])
			}

			cxSelectApi.detach()
			cxSelectApi.setOptions({
				url: this.optionDataSource,
				selects: this.sselects
			});
		}
		super.writeValue(value);
	}

	selectChange(data, i) {
		let tV: string = "";
		if (this.model.value) {
			for (let a = 0; a < i; a++) {
				tV = tV + this.model.value.split(",")[a] + ",";
			}
		}
		tV = tV + data.target.value;
		this.model.reset(tV);

	}

	ngAfterViewInit() {
		let _self = this;
		for (let i=0; i<this.ss.length; i++) {
				if(this.ss[i].indexOf("=")>-1){
					$('#' + this.fieldId + this.sselects[i] + 'id').attr("data-value", this.ss[i].split("=")[1])
				}
			}
		$('#' + this.fieldId).cxSelect({
			url: this.optionDataSource,
			selects: this.sselects
		});
	}

}
