import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'my-form',
  //moduleId: module.id,
  templateUrl: './myform.component.html',
  inputs:[],
  outputs:[]
})

export class MyFormComponent  { 
	@Input() 
	public action:string = "";
	@Input() 
	public title:string;
	
	constructor(){
		//console.log("MyFormComponent init:");
	}

	fireMyEvent(evt:any){
		//this.submitEvent.next(['abc','def']);
	}
}
