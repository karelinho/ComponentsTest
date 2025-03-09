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
}
