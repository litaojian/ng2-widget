import { BaseWidgetRegistry } from '../base/base-widget.registry';

import { StringWidget } from './string/string.widget';

export class BizWidgetRegistry extends BaseWidgetRegistry {
    constructor() {
        super();

        this.register('string', StringWidget);
        
        this.setDefaultWidget(StringWidget);
    }
}
