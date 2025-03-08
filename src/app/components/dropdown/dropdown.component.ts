import { ChangeDetectionStrategy, Component, EventEmitter, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DropdownPanel } from './dropdown-panel';

@Component({
    selector: 'my-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements DropdownPanel {

    @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  
    @Output() closed = new EventEmitter<void>();

    constructor() {}

}