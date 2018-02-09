import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { BaseDataService } from '../../base/base-data.service';


@Component({
  selector: 'my-tree',
  template: `
			<ul [id]="treeId" class="tree tree-chevrons" style="display:block;" data-ride="tree">
            </ul>
			`,			
  inputs:[],
  outputs:[]
})

export class MyTreeComponent implements OnInit, AfterViewInit { 
	
	@Input('tree-id')
	public treeId: string;

	@Input('source')
	public optionDataSource: string;

	@Output('nodeClick') 
	nodeClickEvent = new EventEmitter<any>();

	constructor(_renderer: Renderer, _elementRef: ElementRef, private dataService: BaseDataService){
		//console.log("MyTreeComponent init:");
	}

	ngOnInit() {
		//console.log("name=" + this.name + ", dataSource=" + this.optionDataSource);
		let _parent = this;

		if (this.optionDataSource != null) {
			this.dataService.getTreeData(this.optionDataSource).subscribe(
				treeData => {
					treeData["open"]=true;
					//console.log($('#' + this.treeId));	
					$('#' + this.treeId).tree({'data':treeData});
					$('#' + this.treeId).on('click', 'a', function(event) {
						$('#' + this.treeId + ' li.active').removeClass('active');
						$(this).closest('li').addClass('active');
						//console.log($(this).attr("href"));
						_parent.fireNodeClickEvent($(this).attr("href"));
						return false;
					});
									
				}
			);
		}

	}

	ngAfterViewInit(){
		
	}

	fireNodeClickEvent(href:string){
		//debugger;
		//console.log(JSON.stringify(event));
		let nodeId = href.slice(1);
		this.nodeClickEvent.emit(nodeId);
	}
}


