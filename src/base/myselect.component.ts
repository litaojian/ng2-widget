import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, Renderer2, Optional} from '@angular/core';
import { DefaultValueAccessor, ControlValueAccessor, SelectControlValueAccessor, NgControl, NgModel } from '@angular/forms';
import { ValueListDataService } from './valuelist-data.service';

@Component({
	selector: 'my-select',
	//moduleId: module.id,
	template: `
		<select #theSelect [name]="name" [disabled]="disabled" [class]="styleClass">
			<option *ngFor="let option of options" [selected]="model.value==option.value" [value]='option.value'>{{option.label}}</option>
		</select>`,
	inputs: ['placeholder','formControl'],
	outputs: [],
	providers: [ValueListDataService]
})

export class MySelectComponent extends SelectControlValueAccessor implements OnInit {

	@Input()
	public name: string;
	
	@Input()
	public placeholder: string = null;

	@Input()
	public readonly: boolean = false;

	@Input()
	public disabled: boolean;

	@Input()
	public required: boolean;

	@Input('source')
	public optionDataSource: string;

	@Input('class')
	public styleClass: string;

	options: Object[];

	constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		private dataService: ValueListDataService,
		private model: NgModel)
	{
		super(_renderer, _elementRef);
		this.options = [{ label: "请选择", value: "" }];		
	}

	ngOnInit() {
		
		//console.log("name=" + this.name + ", dataSource=" + this.optionDataSource);
		if (this.optionDataSource != null) {
			this.dataService.getValueList(this.optionDataSource).then(
				resultData => this.processResult(resultData)
			);
		}
		
		if(this.placeholder){
			this.options = [{ label: this.placeholder, value: "" }];	
		}
		// 	
		

	}


	processResult(resultArray: Object[]) {
		//debugger;
		let rows:Object[];
		if (resultArray["data"] != null){
			rows = resultArray["data"]["options"];
			if (rows == null){
				rows = resultArray["data"];
			}						
		}else{
			rows = resultArray;
		}

		if (rows != null) {
			for (var item in rows) { // for acts as a foreach	
				//console.log(rows[item]["keyname"]);
				if (rows[item]["keyname"]){
					this.options.push({ value: rows[item]["keyname"], label: rows[item]["valuetext"] });
				}else if (item["keyname"]){
					this.options.push({ value: item["keyname"], label: item["valuetext"] });
				}else if (Number.parseInt(item) >= 0 ){
					this.options.push({ value: rows[item]["optvalue"], label: rows[item]["optlabel"] });
				}								
			}

		}
	}

}

