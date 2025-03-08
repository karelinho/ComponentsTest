import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DropdownTriggerForDirective } from './directives/dropdown-trigger-for.directive';
import { NgFor } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { DropdownItem } from './components/dropdown/dropdown.interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    OverlayModule,
    DropdownComponent,
    DropdownTriggerForDirective,
    NgFor
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ComponentsTest';

  dropdownItems: DropdownItem[] = [
    { code: 'item1', text: 'Item 1' },
    { code: 'item2', text: 'Item 2' },
    { code: 'item3', text: 'Item 3' }
  ];
  selectedDropdownItems: DropdownItem[] = [];
  dropdownInputValue = '';

  onDropdownItemClick(item: DropdownItem) {
    const clickedItem: DropdownItem | undefined = this.selectedDropdownItems.find((value) => value.code === item.code);
    if (!clickedItem){
      this.selectedDropdownItems.push(item);
      this.dropdownInputValue = this.stringyfyDropdownItems(this.selectedDropdownItems);
    } else {
      this.selectedDropdownItems = this.selectedDropdownItems.filter((value) => value.code !== item.code);
      this.dropdownInputValue = this.stringyfyDropdownItems(this.selectedDropdownItems);
    }
  }

  private stringyfyDropdownItems(items: DropdownItem[]): string {
    return items.map((item) => item.text).join(', ');
  }
}
