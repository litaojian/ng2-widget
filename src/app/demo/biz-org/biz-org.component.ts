import { Component, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';

import { BizQueryComponent } from '../../../../lib/my-app';
import { TestRecService } from '../test-rec/testRec.service';
import { BizTreeTableComponent } from '@yg-widget/biz-app';


@Component({
  selector: 'biz-org',
  templateUrl: './biz-org.component.html',
  styleUrls: []
})
export class BizOrganizationComponent extends BizTreeTableComponent implements OnInit, OnDestroy {
  _treeNodes:any;

  constructor(injector: Injector, private service: TestRecService) {
    super(injector);
    this.bizService = service;
    console.log("BizOrganizationComponent init .........");
    this._treeNodes = [
      {
        id: 1,
        name: '系统菜单树',
        children: [
          {
            id: 2,
            name: 'child1'
          }, {
            id: 3,
            name: 'child2'
          }
        ]
      }, {
        id: 4,
        name: 'root2'
      }
    ];
  }

  ngOnInit() {
    super.ngOnInit();
    //this.setPageSize(10);
  }


  ngOnDestroy() {
    //console.log(" testRec ngOnDestory......");				
  }


}
