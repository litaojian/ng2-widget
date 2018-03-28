import { Injectable, Injector, EventEmitter} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';

import { BaseDataService } from '../../base/base-data.service';
declare const $: any;

export interface TreeNodeClickEventCallback {
	onNodeEvent(event:any, treeId:string, treeNode:any);
}

/**
 *  ztree服务处理类
 */
@Injectable()
export class ZxTreeService extends BaseDataService {
	
	nodeCheckEventCallback:TreeNodeClickEventCallback;

	nodeClickEventCallback:TreeNodeClickEventCallback;

	treeDataCache:Object[];
	
    constructor(injector: Injector) {
		super(injector);
		console.log("ZxTreeService init ..................");
	}

	/**
	 * 清除树缓存数据
	 */
	clearCache(){
		this.treeDataCache = null;
	}

	findNodeById(node, idKey, nodeId){
		if (node[idKey] == nodeId){				
			return node; 
		}
		let childrenNodes = node["children"];
		if (childrenNodes){
			for(let i = 0; i < childrenNodes.length; i++){
				let node = this.findNodeById(childrenNodes[i], idKey, nodeId);
				if (node != null){
					return node;
				}
			} 
		}
		return null;
	}

	loadTreeData(treeDataSource):Observable<Object[]>{
		if (this.treeDataCache != null){
			return ArrayObservable.of(this.treeDataCache);
		}		
		return this.getTreeData(treeDataSource).do(treeData => {
			this.treeDataCache = treeData;
			return treeData;
		});
	}
	/**
	 * 
	 */
	getDefaultOptions(){
		var treeSettings = {
			check: { 
				enable: false,
				chkboxType :{ "Y" : "ps", "N" : "ps" }
			},
			view: {
				dblClickExpand: true,
				showIcon: true,
			},
			data: {
				simpleData: {
					enable: true,
					target:'_self',
					idKey: 'id',
					pIdKey: 'pId',
					rootPid: null
				},
				key: {
					name: 'title'
				},
			},

			callback: {
				onClick: function(e, treeId, treeNode, nodeId){
				},
				onCheck: function(e, treeId, treeNode){					
				}
			}
		};

		return treeSettings;
	}

	setNodeCheckEventCallback(myCallback:TreeNodeClickEventCallback){
		this.nodeCheckEventCallback  = myCallback;
	}

	setNodeClickEventCallback(myCallback:TreeNodeClickEventCallback){
		this.nodeClickEventCallback = myCallback;
	}


    initZtree(treeSettings:any, selectNodeId:string){
		let _parent = this;	
		let idKey = treeSettings["data"]["simpleData"]["idKey"]; 
		//debugger;
		treeSettings["callback"]["onClick"] = function(event, treeId, treeNode, nodeId){
			// 禁止冒泡
			event.stopPropagation();
			//console.log("treeNode click event: nodeId=" + treeNode[idKey]);
			//debugger;
			let result = false;
			if (treeSettings.nodeClickEvent){
				treeSettings.nodeClickEvent.emit(treeNode[idKey]);				
			}
			if (_parent.nodeClickEventCallback){
				result = _parent.nodeClickEventCallback.onNodeEvent(event, treeId, treeNode);
			}
			return result;
		};	
		treeSettings["callback"]["onCheck"] = function(event, treeId, treeNode){
			// 禁止冒泡
			event.stopPropagation();			
			
			let result = false;
			if (_parent.nodeCheckEventCallback != null){
				result = _parent.nodeCheckEventCallback.onNodeEvent(event, treeId, treeNode);
			}			
			return result;		
		};	

		//console.log("name=" + this.name + ", dataSource=" + this.treeDataSource);
		if (treeSettings['treeDataSource'] != null) {
			this.getTreeData(treeSettings['treeDataSource']).subscribe(
				treeData => {
					//console.log("getTreeData process start....");
					//debugger;	
					treeData["open"]=true;										
					$.fn.zTree.init($("#" + treeSettings['treeId']), treeSettings, treeData);
					// 选中节点					
					//console.log("ztree select id : " + nodeId);					
					if (selectNodeId != null){
						var treeObj = $.fn.zTree.getZTreeObj(treeSettings['treeId']);
						var nodes = treeObj.getNodes();
						if (nodes.length> 0) {
						// 	var node = treeObj.getNodeByParam("id", 1, null);
							let node = treeObj.getNodeByParam(idKey,selectNodeId, null);
							//console.log("select node:" + JSON.stringify(node));
						 	treeObj.selectNode(node);
						}
					}
				}
			);
			
		}
    }

	getSelectedNodes(treeId:string){
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		var nodes = treeObj.getCheckedNodes(true);
		return nodes;
	}
	
	saveTreeStatus(treeId:string, restUrl:string){
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		var nodes = treeObj.getCheckedNodes(true);
		let result = this.ajaxPut(restUrl, nodes).subscribe(result =>{
			console.log("ajaxPost:" + JSON.stringify(result));
		});
	}
}    