import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { ChooseAreaService } from './areachoose.service';
import { ITreeOptions } from 'angular-tree-component';
declare var $: any;
@Component({
  selector: 'nz-area2',
  templateUrl:'./areachoose.component.html',
  styleUrls: ['./areachoose.component.css']
})
export class AreaComponent implements OnInit {
  _cityUrl: string;//树的url
   _kkUrl: string;//卡口的url
  myLoading = false;//加载
  data: any[] = [];//保存卡口的数据
  nodes: any[] = [];//保存树的数据
  pagination:any;//页数
  searchList:any;//查询条件
  datanums:any//卡口总数
  kkLists:any={
     kkList:[],
     kkListBh:[]
  }
  @Input()
    set cityUrl(value: string) {
      this._cityUrl = value;
    }
  @Input()
    set searchkkUrl(value: string) {
      this._kkUrl = value;
    }
  //树的数据格式
  @Input()
    fieldKey:any={
      
    };
  constructor(private subject: NzModalSubject,private chooseAreaService: ChooseAreaService) {
    this.pagination={
         pageIndex:1,
         pageSize:10,
         kdmc:''
    }

  }
// node =[{
//       id: '1',
//       dmsm1: 'root1',
//       children: [{id: '2', dmsm1: '市辖区'}]
//     }]
// options: ITreeOptions = {
//     idField: 'dmz',
//     displayField: 'dmsm1',
//     childrenField: 'children'
// };
//重置树的字段，默认是id和name
options: ITreeOptions = {
    idField: '',
    displayField: '',
    childrenField: 'children'
};
ngOnInit() {
    //配置树的字段，可以从父组件配置
    this.options.displayField=this.fieldKey.text;
    this.options.idField=this.fieldKey.value;
    console.log(this.options.displayField);
    //获取树的数据
    this.chooseAreaService.getCityList(this._cityUrl).subscribe(data => { 
                data = data.rows || data.data;           
                this.nodes=data;
    });
}
//获取卡口数据
_console(e,kkmc,kkbh) {
      if(e==true){
          this.kkLists.kkList.push(kkmc); 
          this.kkLists.kkListBh.push(kkbh); 
      }else{
          for(let i=0;i<this.kkLists.kkList.length;i++){
                  if(this.kkLists.kkList[i]==kkmc){
                  this.kkLists.kkList.splice(i,1);
                  }
              }
          for(let i=0;i<this.kkLists.kkListBh.length;i++){
              if(this.kkLists.kkListBh[i]==kkbh){
                  this.kkLists.kkListBh.splice(i,1);
              }
          }
      }
    console.log(this.kkLists);
  }
  //数据上传到父组件
emitDataOutside(e) {
     this.subject.next(this.kkLists);
     this.subject.destroy('onCancel');
  }
  //关闭
handleCancel(e) {
     this.subject.destroy('onCancel');
  }
  //页数改变
indexChange(e){
     this.pagination.pageIndex=e;
     this.searchKK();
  }
  // 获取卡口数据
 getKKou(citys){
     for(let i in citys.node.data){
          if(i==this.fieldKey.value){
              this.pagination.xzqh=citys.node.data[i];
              // alert(citys.node.data[i]);
          }
     }
     this.pagination.kdmc='';
     this.searchKK();
  } 
  // 查询卡口
 searchByInput(){
     if(this.pagination.kdmc==''){
           alert('卡口不能为空');
           return;
     }
     this.pagination.xzqh='';
     this.searchKK();
  }
  // 获取卡口的方法
 searchKK(){
     this.myLoading=true;
     this.searchList=$.extend({},this.pagination);
     this.chooseAreaService.getCityValue(this._kkUrl,this.searchList).subscribe(data => { 
                  let res = data.rows || data.data;             
                  this.data=res;
                  this.datanums=data.total;
                  for(let i=0;i<this.data.length;i++){
                        this.data[i].checked=false;
                   }
                  this.myLoading=false;
                  console.log(this.data);
     });
  }
}