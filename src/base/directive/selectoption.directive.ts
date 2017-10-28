import { Directive, Renderer2, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import { ValueListDataService } from './../valuelist-data.service';


@Directive({ selector: '[mySelectOptions]' })
export class DxSelectOptionsDirective implements OnInit, AfterViewInit {

	optionDataSource: string = "";

	constructor(private el: ElementRef, private _renderer2: Renderer2, private dataService: ValueListDataService) {
		//el.nativeElement.style.backgroundColor = 'yellow';
		console.log("SelectOptionsDirective init ......");

	}

	@Input()
	set mySelectOptions(newValue: any) {
		this.optionDataSource = newValue;
	}

	ngOnInit() {
		//console.log("name=" + this.name + ", dataSource=" + this.optionDataSource);
		if (this.optionDataSource != null) {
			this.dataService.getValueList(this.optionDataSource).then(
				resultData => this.processResult(resultData)
			);
		}

	}


	processResult(resultArray: Object[]) {
		//debugger;
		//console.log("valuelist json:" + JSON.stringify(resultArray));

		let rows: Object[];
		if (resultArray["data"] != null) {
			rows = resultArray["data"]["options"];
			if (rows == null) {
				rows = resultArray["data"];
			}
		} else {
			rows = resultArray;
		}

		if (rows != null) {
			let text: string;
			let value: any;
			for (var item in rows) { // for acts as a foreach	
				//console.log(rows[item]["keyname"]);
				if (rows[item]["keyname"]) {
					text = rows[item]["valuetext"];
					value = rows[item]["keyname"];
				} else if (item["keyname"]) {
					text = item["valuetext"];
					value = item["keyname"];
				}
				let node = this._renderer2.createElement("option");
				node["value"] = value;
				node["text"] = text;
				this._renderer2.appendChild(this.el.nativeElement, node);
			}
		}
	}

	ngAfterViewInit(): void {
		// throw new Error("Method not implemented.");
	}


}