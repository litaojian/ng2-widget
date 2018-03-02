import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'nz-demo-component',
  templateUrl: './simple-table-fifter.component.html',
  styles  : [
      `
      :host ::ng-deep .customize-footer {
        border-top: 1px solid #e9e9e9;
        padding: 10px 18px 0 10px;
        text-align: right;
        border-radius: 0 0 0px 0px;
        margin: 15px -16px -5px -16px;
      }
    `
  ]
})
// <i class="{{c.filterIcon}}" [ngClass]="{'ant-table-filter-selected': c.filtered}" *ngIf="c.filters.length" (click)="showModalForComponent()"></i>
export class SimpleTableFifterComponent implements OnInit {
 @Input()
 name:any;
 @Input()
 placeHolder:any;
 @Input()
 selectUrl:any;
  _dateRange = [null, null];
  search:any={
     input:'',
     select:''
  }
  _dateRangeTime=[];
  emitDataOutside() {
    if(this.name=='time'){
        for(let i=0;i<this._dateRange.length;i++){
          var d = new Date(this._dateRange[i]);  
          var youWant=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
          this._dateRangeTime.push(youWant);
          this.subject.next(this._dateRangeTime);
        }
    }else{
         this.subject.next(this.search);
    }
    // console.log(this._dateRangeTime);
    // this.subject.next(this._dateRangeTime);
    this.subject.destroy('onCancel');
  }

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }

  constructor(private subject: NzModalSubject) {
    this.subject.on('onDestory', () => {
      console.log('destroy');
    });
  }

  ngOnInit() {
  }
}