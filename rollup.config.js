const resolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/router': 'ng.router',
    '@angular/common/http': 'ng.common.http',
    '@angular/forms': 'ng.forms',
    '@angular/cdk/esm5': 'ng.cdk.esm5',
    '@angular/cdk/coercion': 'ng.cdk.coercion',
  
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/operators': 'Rx.Observable.prototype',
    'rxjs/observable/of': 'Rx.Observable',
    'rxjs/observable/zip': 'Rx.Observable',
    'rxjs/observable/fromEvent': 'Rx.Observable',
    'rxjs/observable/FromEventObservable': 'Rx.Observable',
    'rxjs/observable/combineLatest': 'Rx.Observable',
    'rxjs/observable/ArrayObservable': 'Rx.Observable',
    'rxjs/observable/ErrorObservable': 'Rx.Observable',
    'rxjs/add/operator/catch': 'Rx.add',
    'rxjs/add/operator/map': 'Rx.add',
    'rxjs/add/operator/do': 'Rx.add',
    'rxjs/add/operator/delay': 'Rx.add',
    'rxjs/add/operator/toPromise': 'Rx.add',
    'ng-zorro-antd': 'ngZorro.antd',
    'crypto-js': 'crypto-js',    
    'moment': 'moment',
    'file-saver': 'file-saver',
    
    '@delon/theme': '@delon/theme',
    '@delon/acl': '@delon/acl'
};

module.exports = {
    rollup: require('rollup'),
    context: 'this',
    output: {
        name: 'yg.widget',
        file: 'yg-widget.umd.js',
        format: 'umd',
        sourcemap: true,
        globals: globals
    },
    plugins: [
        replace({ "import * as moment": "import moment" }),
        resolve({
            jsnext: true,
            main: true

        })
    ],
    external: Object.keys(globals)
};