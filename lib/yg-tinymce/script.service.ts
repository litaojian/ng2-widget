import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ScriptService {

    private loaded = false;
    private list: any = {};
    private emitter: Subject<boolean> = new Subject<boolean>();

    constructor(@Inject(DOCUMENT) private doc: any) {}

    getChangeEmitter() {
        return this.emitter;
    }

    load(path: string) {
        if (this.loaded) {
            return this;
        }

        this.loaded = true;

        const promises: Promise<any>[] = [];

        [ path ].forEach((script) => promises.push(this.loadScript(script)));

        Promise.all(promises).then(res => {
            this.emitter.next(true);
        });

        return this;
    }

    loadScript(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.list[path] === true) {
                resolve(<any>{
                    path: path,
                    loaded: true,
                    status: 'Loaded'
                });
                return;
            }

            this.list[path] = true;

            const node = this.doc.createElement('script');
            node.type = 'text/javascript';
            node.src = path;
            node.charset = 'utf-8';
            if ((<any>node).readyState) { // IE
                (<any>node).onreadystatechange = () => {
                    if ((<any>node).readyState === 'loaded' || (<any>node).readyState === 'complete') {
                        (<any>node).onreadystatechange = null;
                        resolve(<any>{
                            path: path,
                            loaded: true,
                            status: 'Loaded'
                        });
                    }
                };
            } else {
                node.onload = () => {
                    resolve(<any>{
                        path: path,
                        loaded: true,
                        status: 'Loaded'
                    });
                };
            }
            node.onerror = (error: any) => resolve(<any>{
                path: path,
                loaded: false,
                status: 'Loaded'
            });
            this.doc.getElementsByTagName('head')[0].appendChild(node);
        });
    }
}
