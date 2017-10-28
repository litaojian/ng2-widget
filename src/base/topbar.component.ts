import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute, Params } from '@angular/router';
import { ValueListDataService } from './valuelist-data.service';

@Component({
	selector: 'topbar',
	template: `
		<nav class="navbar navbar-main navbar-fixed-top" role="navigation" id="mainNavbar">
			<div class="navbar-header">
				<a [routerLink]="moduleUrl" class="navbar-brand">{{moduleLabel}}</a>
			</div>
			<ul class="nav navbar-nav">
				<li *ngFor="let menu of navMenuList" [ngClass]="{'active':menu.menuUrl == currentMenuUrl}">
					<a [routerLink]="menu.menuUrl" [attr.data-id]="menu.menuUrl" class="app-btn open">{{menu.label}}</a>
				</li>
			</ul>
		</nav>`,
	inputs: [],
	outputs: []
})

export class TopbarComponent implements OnInit, AfterViewInit {

	// 当前模块名称
	moduleUrl: string;

	@Input("title")
	moduleLabel: string;

	// 导航菜单
	navMenuList: Object[] = [];

	constructor(private dataService: ValueListDataService, private route: ActivatedRoute) {
		//console.log("MyTreeComponent init:");
	}

	ngOnInit() {

	}

	ngAfterViewInit() {

	}

	fireMyEvent(event: any) {
		//this.submitEvent.next(['abc','def']);
	}
}

