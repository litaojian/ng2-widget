import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">     
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" routerLink="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" routerLink="/page/admin/organization/tree">部门</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" routerLink="/page/admin/menu/tree">菜单</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" routerLink="/page/admin/user/tree">用户</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" routerLink="/page/admin/role/list">角色</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" routerLink="/page/admin/permission/list">权限</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" routerLink="/page/demo/testRec">Other</a>
                </li>
                
            </ul>
        </div>
    </nav>
    <div style="margin-top: 16px;"><router-outlet></router-outlet></div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
