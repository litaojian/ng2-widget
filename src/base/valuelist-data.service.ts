import { Injectable,Injector } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { BaseService } from './base-all.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ValueListDataService extends BaseService {

	private headers = new Headers({ 'Content-Type': 'application/json' });
	protected apiUrl = '/api/data/valuelist';  // URL to web API

	protected http: Http;
	protected isTest: boolean = true;

	protected static CachedDataMap:Map<string, any> = new Map();

	constructor(injector: Injector) {
		super(injector);
		this.isTest = !environment.production;
		//
		//console.log("ValueListDataService constructor");
	}

	setIsTest(value: boolean) {
		this.isTest = value;
	}

	getValueList(typeName: string): Promise<Object[]> {
		//debugger;
		let data = ValueListDataService.CachedDataMap.get(typeName);
		if (data && data instanceof Array && data.length > 0 ){
			// get data from data cache
			//console.log(typeName + " data found in cached, " + data.length);
			return Promise.resolve(data);
		}

		let url = `${this.apiUrl}/${typeName}`;
		if (typeName.startsWith("/assets")){
			url = typeName;
		}
		let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		let options = new RequestOptions({ "headers": headers });
		let customUrl:string;
		let tableColumns:string;

		if (!this.isTest) {
			url = this.formatUrl(url);						
		}else{
			if (typeName.startsWith("/api")){								
				let splitPos = typeName.indexOf("?");	
				customUrl = typeName.substring(0, splitPos);
				if (splitPos  > 0){
					tableColumns = typeName.substring(splitPos);
					tableColumns = tableColumns.replace("?cols=","");
					//console.log("getValueList: tableColumns=" + tableColumns);										
				}else {
					customUrl = typeName;
				}				
				url = customUrl;
			}
		}

	
		// invoke http request
		return this.http.get(url, options)
			.toPromise()
			.then(response => { 
				let result = response.json() as Object[];	
				//debugger;
				if (tableColumns != null && result != null){
					let columns = tableColumns.split(",");
					let data = result["data"];
					for(let i = 0;i < data.length;i++){
						data[i]["keyname"] = data[i][columns[0]];
						data[i]["valuetext"] = data[i][columns[1]];
					}
				}
				// cache the valuelist
				ValueListDataService.CachedDataMap.set(typeName, result);			
				return result;
			})
			.catch(this.handleError);

	}


	handleError(error: any): Promise<any> {
		//console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}


	getTreeData(dataUrl: string): Promise<Object[]> {
		//debugger;
		let url = `${dataUrl}`;
		let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		let options = new RequestOptions({ "headers": headers });
		let customUrl:string;
		let tableColumns:string;

		if (!this.isTest) {
			url = this.formatUrl(url);			
		}else{
			if (dataUrl.startsWith("/api")){								
				let splitPos = dataUrl.indexOf("?");	
				customUrl = dataUrl.substring(0, splitPos);
				if (splitPos  > 0){
					tableColumns = dataUrl.substring(splitPos);
					tableColumns = tableColumns.replace("?cols=","");
					//console.log("getValueList: tableColumns=" + tableColumns);										
				}				
				url = customUrl;
			}
			
		}
	
		// invoke http request
		return this.http.get(url, options)
			.toPromise()
			.then(response => { 
				//debugger;
				let result = response.json() as Object[];	
				if (tableColumns != null && result != null){
					let columns = tableColumns.split(",");
					let idColumn = columns[0];
					let parentColumn = columns[1];
					let textColumn = columns[2];					 
					result = this.buildTree(result, idColumn, parentColumn, textColumn);
				}	
				if (result["rows"] != null && result["children"] == null && result["resultCode"] == 0){
					result = result["rows"];
				}
				//debugger;							
				return result;
			})
			.catch(this.handleError);

	}

	//构造树的方法
    buildTree(input: Object, idColumn:string, parentColumn:string, textColumn:string): any {
        //console.error('An error occurred', error);
        let inputData = input["data"];

		let treeData: Object[] = [];
        let tmpNodes: Object[] = [];
        for (let i = 0; i < inputData.length; i++) {
            // debugger;
            let tmpNode = new Object();
            tmpNode["html"] = "<a href='javascript:void(0);'>" + inputData[i][textColumn] + "</a>";
			tmpNode["title"] = inputData[i][textColumn];            
            tmpNode["nid"] = inputData[i][idColumn];
            tmpNode["parentId"] = inputData[i][parentColumn];
            tmpNode["open"] = true;
            let pnode = this.findParent(tmpNodes, inputData[i][parentColumn]);
            if (pnode != null) {
                if (pnode["children"] ==null){
                    pnode["children"] = [];
                }    
                pnode["children"].push(tmpNode);
            }else{
                tmpNodes.push(tmpNode);
            }
        }
        treeData = tmpNodes;
        return treeData;
        //return JSON.stringify(treeData);
    }

    findParent(nodes: any, nid: number): any {
        if (nid > 0) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i]["nid"] == nid) {
                    return nodes[i];
                }
				if (nodes[i]["children"] != null){
					let pnode = this.findParent(nodes[i]["children"], nid);
					if (pnode != null){
						return pnode;
					}	
				}				
            }
        } else {
            return null;
        }
    }

}
