import { Component } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { Router } from '@angular/router';


@Component({
	template:
		`<div class="clearfix"></div><router-outlet></router-outlet><router-outlet name="popup2"></router-outlet> `,
  	inputs:[],
  	outputs:[]
})

export class PageComponent{ 
	
	constructor() {		
	}

}
