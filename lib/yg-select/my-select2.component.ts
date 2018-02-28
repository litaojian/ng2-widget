import { ControlValueAccessor } from '@angular/forms/src/directives';
import { Component, forwardRef, Input,OnInit,ElementRef,Output,EventEmitter} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectService } from './my-select2.service';
declare var $: any;
@Component({
  selector: 'nz-select2',
  templateUrl: './my-select2.component.html',
  providers: [ 
          {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NzSelect2Component),//注入表单控件
            multi: true
          }]
})
export class NzSelect2Component implements OnInit{
   constructor(private selectService:SelectService) { 
    }
  innerValue: any = ''; 
  //监听绑定的值，与外岑的ngModel相互绑定
  set selectedOption(val:any){
      if (val !== this.innerValue) {
            this.innerValue = val;
            this.onChangeCallback(val.value);
            this.dataBack.emit(val.value);  // 事件
        }
  }
  get selectedOption():any{
       return this.innerValue;
  }
  options = [];//接收select的数组
   _dataSource:any;//接收本地的自定义数组或者请求返回的数组
  @Input()
  url:any;//请求的url
  @Input()
  myPlaceHolder:any;//自定义的PlaceHolder
  @Input()
  //下拉框的数据格式
	fieldKey:any = {
	  	text: 'text',
		  value: 'value'
	};
  @Input()
	set dataSource(val: any) {
		this._dataSource = val;
		if ($.isArray(this._dataSource)) {      
        this.options=this._dataTransform(this._dataSource);//如果是本地数组或直接请求的数组直接复制
	 	}
	}
	get dataSource(): any {
		return this._dataSource;
	}
  @Output() dataBack = new EventEmitter<any>();
  registerOnChange(fn: (value: any) => void) { 
     this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
     this.onTouchedCallback = fn;
  }
 	writeValue(value: string) {

	}
  onChangeCallback = (value: any) => {};
  onTouchedCallback = (value: any) => {};
  ngOnInit() {
         //如果url存在则直接请求
        if(this.url){
            this.selectService.getValue(this.url).subscribe(data => { 
               data = data.rows || data.data;        
               this.options=this._dataTransform(data);
            });
        }     
  }
  //转换下拉框下的字段
   _dataTransform(data: Array<any>){
       let _data = [];
       for (let i = 0; i < data.length; i++) {
          _data[i] = {};
          _data[i].label = data[i][this.fieldKey.text];
          _data[i].value = data[i][this.fieldKey.value];
        }
        return _data;
  }
}