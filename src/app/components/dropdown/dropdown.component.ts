import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, input, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DropdownPanel } from './dropdown-panel';
import { DropdownItem } from './dropdown.interfaces';
import { NgFor } from '@angular/common';

@Component({
    selector: 'my-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    standalone: true,
    imports: [
        NgFor
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements DropdownPanel {

    @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;

    items = input<DropdownItem[]>();
  
    @Output() closed = new EventEmitter<void>();

    @Output() select = new EventEmitter<string>();

    selectedDropdownItems: DropdownItem[] = [];

    dropdownInputValue = '';

    constructor(private changeRef: ChangeDetectorRef) {}

    onDropdownItemClick(item: DropdownItem) {
        const clickedItem: DropdownItem | undefined = this.selectedDropdownItems.find((value) => value.code === item.code);
        if (!clickedItem){
            this.selectedDropdownItems.push(item);
            item.selected = true;
        } else {
            this.selectedDropdownItems = this.selectedDropdownItems.filter((value) => value.code !== item.code);
            item.selected = false;
        }
        this.select.emit(this.stringyfyDropdownItems(this.selectedDropdownItems));
        this.changeRef.markForCheck();
    }

    private stringyfyDropdownItems(items: DropdownItem[]): string {
        return items.map((item) => item.text).join(', ');
    }
}