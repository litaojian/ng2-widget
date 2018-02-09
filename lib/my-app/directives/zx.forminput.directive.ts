// tslint:disable
import { Injector, Directive, ElementRef, Renderer2, Attribute, Input, HostListener, OnInit, AfterViewInit, AfterContentInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';


/**
 * 
 * ```html
 * <input zxInput input-value="${today}$">
 * ```
 */
@Directive({ selector: '[zx-formInput]' })
export class ZxFormInputDirective implements OnInit, AfterContentInit, AfterViewInit {

    /** 缺省值-参数 */
    @Input('value') _dataValue: string;

    @Input('name') _name: string;

    @Input('formData') _formData:Object = {};

    activatedRoute: ActivatedRoute;

    constructor(
        private _renderer2: Renderer2,
        private el: ElementRef,
        injector: Injector) {

        this.activatedRoute = injector.get(ActivatedRoute);
    }

    ngOnInit() {
        console.log("ZxFormInputDirective ngOnInit ......");
        
        let params = {};
        let formElement = document.getElementById("queryForm");
        if (formElement != null) {
            let itemNodes = formElement.getElementsByTagName("INPUT");         
            for (let i = 0; i < itemNodes.length; i++) {
                this.parseInputField(itemNodes[i], params);
            }
            //
            itemNodes = formElement.getElementsByTagName("NZ-INPUT");
            for (let i = 0; i < itemNodes.length; i++) {
                this.parseInputField(itemNodes[i], params);
            }
            itemNodes = formElement.getElementsByTagName("NZ-SELECT");
            for (let i = 0; i < itemNodes.length; i++) {
                this.parseInputField(itemNodes[i], params);
            }
            itemNodes = formElement.getElementsByTagName("NZ-DATEPICKER");
            for (let i = 0; i < itemNodes.length; i++) {
                this.parseInputField(itemNodes[i], params, "date");
            }

        }

        let keys = Object.keys(params).sort();
        for (let i = 0; i < keys.length; i++) {
            this._formData[keys[i]] = params[keys[i]];
        }
        
    }
    ngAfterContentInit(){

    }

    ngAfterViewInit() {        

    }

    @HostListener("click",["$event","$param1"])
    onClick(e, param1){
        console.log("ZxFormInputDirective onClick.......");        
        //console.log("target = " + e.target.tagName);        
        //console.log(e);                
        if (e.target.tagName == "FORM"){
            let eventData = e.target.getAttribute("eventData");
            if (eventData != null){
                let params = JSON.parse(eventData);
                let keys = Object.keys(params).sort();
                for (let i = 0; i < keys.length; i++) {
                  if (this._formData[keys[i]] instanceof Date){
                    this._formData[keys[i]] = new Date(params[keys[i]]);
                  }else{
                    this._formData[keys[i]] = params[keys[i]];
                  }                  
                }        
            } 
            e.target.removeAttribute("eventData");          
        }

    }

    formatDate(date:Date) {
        //day:The representation of the day. 
       // Possible values are "numeric", "2-digit".

        let formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };        
        var tmp = date.toLocaleDateString('zh-CN', formatOptions);
        tmp = tmp.replace('年', '-');
        tmp = tmp.replace('月', '-');
        tmp = tmp.replace('日', '');
        tmp = tmp.replace('/', '-');  
        tmp = tmp.replace('/', '-');
        return tmp;
    }

    parseInputField(inputElement, params, inputType?) {
        let inputId: string = inputElement.getAttribute("id");
        let inputValue: any = inputElement.getAttribute("data-value");
        if (inputValue == null){
            inputValue = inputElement.getAttribute("value");            
        }         
        let inputName: string = inputElement.getAttribute("name");
        let defaultValue = inputElement.getAttribute("data-default");
        if (inputName == null && inputValue == null) {
            inputValue = inputElement.parentNode.getAttribute("data-value");
            if (inputValue == null){
                inputValue = inputElement.parentNode.getAttribute("value");            
            }     
            inputName = inputElement.parentNode.getAttribute("name");
        }
        
        let subInputElements = inputElement.getElementsByTagName("input");
        if (subInputElements){
            for(let i = 0; i < subInputElements.length; i++){                
                subInputElements[i].setAttribute("data-type", inputType ? "text":inputType);                
                subInputElements[i].setAttribute("name", inputName);                
            }
        }

        if (inputValue != null) {
            if (inputName == null){
                inputName = "";
            }
            inputValue = inputValue.trim();
            inputName = inputName.trim();

            if (inputValue == "${today}$") {
                let _date: Date = new Date();                
                inputValue = this.formatDate(_date);
                //inputValue = _date.toLocaleString('yyyy-MM-dd');
            } else if (inputValue == "${beginOfWeek}$") {
                let _date: Date = new Date();
                while (_date.getDay() != 1) {
                    _date.setDate(_date.getDate() - 1);
                }
                inputValue =  this.formatDate(_date);
            } else if (inputValue == "${endOfWeek}$") {
                let _date: Date = new Date();
                //debugger;
                while (_date.getDay() != 0) {
                    _date.setDate(_date.getDate() + 1);
                    //console.log("day:" + _date.getDay());
                }
                inputValue = this.formatDate(_date);
                
            } else if (inputValue == "${loginUserId}$") {
                //inputValue = <string>this.service.getLoginId();
            } else if (inputValue.startsWith("${request.") && inputValue.endsWith("}$")) {
                let paramKey = inputValue.substring(10, (inputValue.length - 2));
                inputValue = this.activatedRoute.snapshot.queryParams[paramKey];
                if (inputValue == null){
                    inputValue = this.activatedRoute.snapshot.data[paramKey];                    
                }
                if (inputValue == null) {
                    inputValue = defaultValue;
                }
            }
            params[inputName] = inputValue;
        }

    }

}
