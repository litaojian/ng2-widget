# yg-widget [![NPM version](https://img.shields.io/npm/v/yg-widget.svg)](https://www.npmjs.com/package/yg-widget)

## Installation instructions

Install `yg-widget` from `npm`

```bash
npm install yg-widget --save
```

**Recommend:** You will need `tinymce.min.js` file via [Build Customizer](https://www.tinymce.com/download/custom-builds/) generate.

Import the `yg-widget` in to your root `AppModule`.

```typescript
import { NgxTinymceModule } from 'yg-widget';

@NgModule({
    imports: [
        NgxTinymceModule.forRoot({
            baseURL: './assets/tinymce/',
            // or cdn
            baseURL: '//cdn.bootcss.com/tinymce/4.7.4/'
        })
    ]
})
export class AppModule { }
```

### Usage

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<tinymce [(ngModel)]="html"></tinymce>`
})
export class AppComponent  {
    html = ``;
}
```

### How to use it with:

+ `angular-cli` please refer to **Installation instructions**.
+ `stackblitz` sample available [here](https://stackblitz.com/edit/yg-widget?file=app%2Fapp.component.ts).

## API

| Name    | Type           | Default  | Summary |
| ------- | ------------- | ----- | ----- |
| config | `any` |  | see [configure](https://www.tinymce.com/docs/configure/integration-and-setup/) |
| loading | `string,TemplateRef` | - | Loading status of tinymce |

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/cipchk/yg-widget/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/cipchk/yg-widget/blob/master/LICENSE) file for the full text)
