import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter, input, OnDestroy, OnInit, Output, signal, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DropdownPanel } from './dropdown-panel';
import { DropdownItem } from './dropdown.interfaces';
import { NgFor } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../../constants';

@Component({
    selector: 'my-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    standalone: true,
    imports: [
        NgFor,
        FormsModule,
        ReactiveFormsModule
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements DropdownPanel, OnInit, OnDestroy {

    @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;

    items = input<DropdownItem[]>();

    filteredItems = signal<DropdownItem[]>([]);
  
    @Output() closed = new EventEmitter<void>();

    @Output() select = new EventEmitter<string>();

    selectedDropdownItems: DropdownItem[] = [];

    dropdownInputValue = '';

    filter!: FormControl;

    private _destroyed$: Subject<void> = new Subject<void>();

    constructor(private changeRef: ChangeDetectorRef) {
        this.filter = new FormControl('');
    }

    ngOnInit(): void {
        const items = this.items();
        if (items) {
            this.filteredItems.set(items);
        }
        this.filter.valueChanges.pipe(
            debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME),
            takeUntil(this._destroyed$)
        ).subscribe((filterString: string) => {
            const newItems = this.items()?.filter(item => item.text.toLowerCase().includes(filterString));
            if (newItems) {
                this.filteredItems.set(newItems);
            }
        });
    }

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

    ngOnDestroy() {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}