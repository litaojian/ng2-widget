import { Component, Input,Output, OnInit,EventEmitter } from '@angular/core';
// import { NzModalSubject } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd';
import { AreaComponent } from './areachoose.component';
@Component({
  selector: 'choose-icon',
  template:`
     <i class="anticon anticon-search" (click)="showModalForComponent()" style="font-size:25px;cursor: pointer;" title="点击选择卡口"></i>
  `,
  styles  : [
      `
    `
  ]
})
// <button (click)="showModalForComponent()">点击</button>
export class ChooseIconComponent implements OnInit {
  constructor(private modalService: NzModalService) {
  }
  @Input()
  cityUrl:any;
  @Input()
  searchkkUrl:any;
  //树的数据格式
  @Input()
	fieldKey:any;
  @Output() kkouBack = new EventEmitter<any>();
  ngOnInit() {
  }
  showModalForComponent() {
    const subscription = this.modalService.open({
      title          : '区域选择',
      width          : '1000px',
      content        : AreaComponent,
      onOk() {
      },
      onCancel() {
        // console.log('Click cancel');
      },
      footer         : false,
      componentParams: {
         cityUrl: this.cityUrl,
         searchkkUrl:this.searchkkUrl,
         fieldKey:this.fieldKey
      }
    });
    subscription.subscribe(result => {
        // if(result!=undefined && result.indexOf('on')<0){
        //     console.log(result);
        //     this.kkouBack.emit(result);
        // }    
        //  console.log(result.indexOf('on'));
         this.kkouBack.emit(result);
    })
  }
  handleOk(e) {

  }
}