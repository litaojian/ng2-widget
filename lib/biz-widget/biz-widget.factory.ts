import { ViewContainerRef, ComponentRef, ComponentFactoryResolver, Injectable } from '@angular/core';
import { BizWidgetRegistry } from './biz-widget.registry';

@Injectable()
export class BizWidgetFactory {
    private resolver: ComponentFactoryResolver;
    private registry: BizWidgetRegistry;

    constructor(registry: BizWidgetRegistry, resolver: ComponentFactoryResolver) {
        this.registry = registry;
        this.resolver = resolver;
    }

    createWidget(container: ViewContainerRef, type: string): ComponentRef<any> {
        let componentClass = this.registry.getWidgetType(type);

        let componentFactory = this.resolver.resolveComponentFactory(componentClass);
        return container.createComponent(componentFactory);
    }
}
