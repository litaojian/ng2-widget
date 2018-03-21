import { ChangeDetectorRef, Component, OnChanges, EventEmitter, Input, Output, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Action, ActionRegistry, FormPropertyFactory, FormProperty, SchemaPreprocessor, ValidatorRegistry, Validator } from './model';
import { SFSchema } from './schema';
import { WidgetFactory } from './widget.factory';
import { SchemaValidatorFactory } from './schema.validator.factory';
import { TerminatorService } from './terminator.service';
import { SchemaFormOptions, NZ_SF_OPTIONS_TOKEN } from './schema-form.options';
import { FormComponent } from './form.component';


export function useFactory(schemaValidatorFactory: any, validatorRegistry: any, options: SchemaFormOptions) {
    return new FormPropertyFactory(schemaValidatorFactory, validatorRegistry, options);
}

@Component({
    selector: 'my-simple-form1',
    template: `
    <form nz-form [nzLayout]="layout" *ngIf="rootProperty && rootProperty.visible">
        <nz-sf-item [formProperty]="rootProperty"></nz-sf-item>
    </form>`,
    styleUrls: [ './patch.less' ],
    providers: [
        ActionRegistry,
        ValidatorRegistry,
        SchemaPreprocessor,
        WidgetFactory,
        {
            provide: FormPropertyFactory,
            useFactory: useFactory,
            deps: [SchemaValidatorFactory, ValidatorRegistry, NZ_SF_OPTIONS_TOKEN]
        },
        TerminatorService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFormComponent extends FormComponent implements OnChanges {

    ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
    }    
}    