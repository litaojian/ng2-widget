import { Component, ViewEncapsulation, Input, ElementRef, Renderer2, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'yg-icon',
    template: ``,
    styleUrls: [
        './style/patch.less'
    ],
    encapsulation: ViewEncapsulation.None
})
export class YgIconComponent implements OnChanges {

    @Input() ygSpin = false;

    @Input() ygType: string;

    _classMap: string[] = [];
    setClass() {
        this._classMap.forEach(cls => this.renderer.removeClass(this.el.nativeElement, cls));

        this._classMap = [ 'anticon' ];

        if (typeof this.ygSpin !== 'undefined' && this.ygSpin !== false)
            this._classMap.push(`anticon-spin`);

        if (this.ygType) this._classMap.push(`anticon-${this.ygType}`);

        this._classMap.forEach(cls => this.renderer.addClass(this.el.nativeElement, cls));
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.setClass();
    }
}
