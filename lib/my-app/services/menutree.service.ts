import { Injectable, Injector, Optional } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from '../../base/services/httpclient.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';


export class MenuInfo {
    id: number;
    label: string;
    url: SafeResourceUrl;
    menuUrl: string;
    icon: string = "";
    //
    children: MenuInfo[];

    constructor() {
    }

    setParams(id: number, label: string, url: SafeResourceUrl, icon: string) {
        this.id = id;
        this.label = label;
        this.url = url;
        this.icon = icon;
    }
    
}

@Injectable()
export class MenuTreeService {

    nodeId:number;
    parentId:string;
    
    nodeName:string;
    nodeLabel:string;
    nodeHtml:string;
    nodeUrl:string;
    children:Object[] = [];
    httpClient:HttpClientService;

    constructor(injector: Injector, private sanitizer: DomSanitizer) {

        this.httpClient = new HttpClientService(injector.get(HttpClient));

        //super(injector);
        //console.log("PortalService init.......");
    }


    hasChildren(){
        if (this.children != null && this.children.length > 0){
            return true;
        }
        return false;
    }
    getChildren(){
        if (this.children != null && this.children.length > 0){
            return this.children;
        }
        return null;
    }

    findParentNode(rootNode:Object, childNode:any):Object{
        //debugger;
        if (childNode == null){
            return null;
        }
        let url = childNode["menuurl"];
        return this.findParentNodeByUrl(rootNode, url);
    }    

    findParentNodeByUrl(node:any, url:string):Object{
        //debugger;
        let children = node["children"];
        if (children!= null){
            for(let i=0;i < children.length;i++){
                let childNode = children[i];
                if(url == childNode["menuurl"]){
                    //console.log("found node " + node + " matched url " + url);
                    return node;
                }
            }       
                
            for(let i=0;i < children.length;i++){
                let childNode = children[i];
                if (childNode["children"] != null){     
                    let foundNode = this.findParentNodeByUrl(childNode, url);
                    if (foundNode != null){
                        return foundNode;
                    }
                }
                    
            }    


        }
        return null;
    }

    findNodeByUrl(node:any, url:string, moduleId:string):Object{
        let children = node["children"];
        //debugger;
        if (children!= null){
            for(let i=0;i < children.length;i++){
                let node = children[i];
                //console.log("the menuUrl is " + node["href"] + ", and the input url is " + url);
                if(url == node["href"]){
                    //console.log("found node " + node + " matched url " + url);
                    return node;
                }else if(moduleId == node["id"]){
                    //console.log("found node " + node + " matched url " + url);
                    return node;
                }
                if (node["children"] != null){
                    let foundNode = this.findNodeByUrl(node, url, moduleId);
                    if (foundNode != null){
                        return foundNode;
                    }
                }
            }            
        }
        return null;
    }

    buildLevel(node:any, level:number){
        //debugger;
        let _children = node["children"];
        if (_children!= null){
            for(let i=0;i < _children.length;i++){
                let node = _children[i];
                node["level"] = level;
                if (node["children"] != null){
                    this.buildLevel(node,(level + 1));
                }
            }            
        }
    }



    getMenuListByPath(menuUrl: string, moduleId?: string) {
        //debugger;
        let menus = this.findMenuListByPath(menuUrl, 1, moduleId);
        return menus;
    }

    getShortcutListByPath(menuUrl: string) {
        return this.findMenuListByPath(menuUrl, 2);
    }

    /**
      * 
      */
    findMenuListByPath(menuUrl: string, level: number, moduleId?:string) : Observable<Object>{

        //debugger;
        //console.log("getMenuListByPath() ---" + menuUrl + "|" + level);
        let params = {};
        //		
        //debugger;	
        let url = null;
        if (url == null){
            url = "assets/menu.json";
        }

        return this.httpClient.ajaxGet(url, {})
            .do((result:any) => {
                //debugger;
                //console.log("debug1:" + JSON.stringify(result));
                let menuItem = new MenuInfo();
                menuItem.children = result["rows"];
                this.buildLevel(menuItem, 1);
                if (level == 0) {
                    return menuItem;
                }
                if(level == 2){
                    //debugger;
                }
                let node:any = this.findNodeByUrl(menuItem, menuUrl, moduleId);
                if (node != null) {
                    //console.log("debug first:" + JSON.stringify(node) + ", input level:" + level);
                    let nodeLevel = node["level"];
                    if (nodeLevel != null && nodeLevel > level) {
                        while (nodeLevel > level) {
                            node = this.findParentNode(menuItem, node);
                            nodeLevel = node["level"];
                        }
                        //                          
                        //console.log("debug final " + nodeLevel +" :" + JSON.stringify(node));        
                    }else if (nodeLevel != level){
                        node = null;
                    }
                }


                if (node != null && node["children"]) {
                    result["children"] = node["children"];
                } else {
                    result["children"] = null;
                }
                return result;
            });
    }

    convertMenuInfo(result: any) {
        //debugger;
        if (typeof (result) == "string") {
            result = JSON.parse(result);
        }
        let menuData = result["children"];
        if (menuData == null){
            //menuData = result["rows"];
        }
        if (result != null && menuData != null) {            
            let menuId: number;
            let menuLabel: string;
            let menuUrl: string;
            let menuIcon: string;

            let navMenuList: MenuInfo[] = [];
            for (var i = 0; i < menuData.length; i++) {
                menuId = i + 1;
                menuLabel = menuData[i]["name"];
                menuUrl = menuData[i]["href"];
                menuIcon = "/theme/default/images/ips/" + menuData[i]["icon"];
                let menu = new MenuInfo();
                menu.setParams(menuId, menuLabel, this.sanitizer.bypassSecurityTrustResourceUrl(menuUrl), menuIcon);
                menu.menuUrl = menuUrl;
                if (menuData[i]["children"] != null) {
                    let subMenuList: MenuInfo[] = [];
                    for (let j = 0; j < menuData[i]["children"].length; j++) {
                        let menuItem = menuData[i]["children"][j];
                        menuId = i + 1;
                        menuLabel = menuData[i]["name"];
                        menuUrl = menuData[i]["href"];
                        menuIcon = "/theme/default/images/ips/" + menuData[i]["icon"];
                        let subMenu = new MenuInfo();
                        subMenu.setParams(menuId, menuLabel, this.sanitizer.bypassSecurityTrustResourceUrl(menuUrl), menuIcon);                        
                        subMenu.menuUrl = menuUrl;
                        subMenuList.push(subMenu);
                    }
                    menu.children = subMenuList;
                }
                navMenuList.push(menu);
            }

            return navMenuList;
        }
    }


}    
