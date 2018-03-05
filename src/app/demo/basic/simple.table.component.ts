import { Component } from '@angular/core';
import { SimpleTableColumn } from '@yg-widget/biz-table';

@Component({
    selector: 'app-demo',
    template: `
    <div class="mb-md">
        <nz-input [(ngModel)]="params.name" name="name" nzPlaceHolder="请输入姓名" style="width: 100px"></nz-input>
        <button nz-button (click)="st.load(1)" [nzType]="'primary'">搜索</button>
        <button nz-button (click)="params = {}; st.reset()">重置</button>
    </div>
    <simple-table #st [data]="url" [extraParams]="params" [total]="total" [columns]="columns"
                [resReName]="{list: 'results' }"></simple-table>
    `
})
export class SimpleTableDemoComponent {
    url = `https://randomuser.me/api/?results=3`;
    params: any = { name: 'asdf' };
    // mock
    total = 100;
    columns: SimpleTableColumn[] = [
        { title: '编号', index: 'id.value' },
        { title: '头像', type: 'img', width: '50px', index: 'picture.thumbnail' },
        { title: '邮箱', index: 'email' },
        { title: '电话', index: 'phone' },
        { title: '注册时间', type: 'date', index: 'registered' }
    ];
}