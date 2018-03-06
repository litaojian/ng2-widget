import { Component, Directive, Optional, EventEmitter, Input, Output, OnInit, AfterViewInit, HostListener, ElementRef, Renderer } from '@angular/core';
import { ValueListDataService } from '../../base/services/valuelist.service';


@Component({
	selector: 'my-label',
	template: `
		 <div [class]='styleClass'>{{fieldText}}<div>
	`,
	inputs:[],
	providers: [ValueListDataService]
})


export class MyLabelComponent  implements OnInit, AfterViewInit {

	@Input("class")
	styleClass:string ="";

	@Input("source")
	dataSource:string;

	@Input("options")
	dataOptions:Object[];

    @Input("value")
	fieldValue:string;

	fieldText:string;
	
	labelDataCache:Object[];
      
	constructor(private dataService: ValueListDataService) {

	}

	ngOnInit() {
		//console.log("MyLabel onInit:" + this.dataSource + "," + this.fieldValue)
        this.fieldText = this.fieldValue;

        if (this.dataSource != null) {
			// this.getLabelData(this.dataSource).then(
			// 	resultData => this.processResult(resultData, this.fieldValue)
			// );
		}
		if (this.dataOptions != null){
			this.processResult(this.dataOptions, this.fieldValue)
		}
	}

	ngAfterViewInit() {
		let _self = this;

	}

	getLabelData(dataSource):Promise<Object[]>{
		if (this.labelDataCache != null){
			//console.log("label data load from cache ....")			
			return Promise.resolve(this.labelDataCache);
		}		
		return this.dataService.getValueList(dataSource).then(valueData => {
			//console.log("label data cache load ok....")
			this.labelDataCache = valueData;			
			return valueData;
		});
	}

	processResult(resultArray: Object[], inputValue:any) {
		//debugger;
		//console.log("valuelist json:" + JSON.stringify(resultArray));
		
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
			//debugger;
            let value, label;
			for (var item in rows) { // for acts as a foreach	
				//console.log(rows[item]["keyname"]);
                let key = rows[item]["keyname"];
				if (rows[item]["keyname"]){
                    value = rows[item]["keyname"];
                    label = rows[item]["valuetext"];
					
				}else if (item["keyname"]){
					value = item["keyname"];
                    label = item["valuetext"];
				}else if (item["optionvalue"]){
					value = item["optionvalue"];
                    label = item["optionlabel"];
				}else if (Number.parseInt(item) >= 0 ){
					value= rows[item]["optvalue"];
					label= rows[item]["optlabel"];
					if (value == null){
						value= rows[item]["value"];
						label= rows[item]["label"];
					}
				}
                if (value == inputValue){
                    this.fieldText = label;
                    return;
                }								
			}

		}
	}

}
