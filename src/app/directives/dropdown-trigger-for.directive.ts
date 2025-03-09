import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    ViewContainerRef
  } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { EMPTY, filter, merge, Observable, Subscription } from 'rxjs';
import { DropdownPanel } from '../components/dropdown/dropdown-panel';

@Directive({
    selector: '[dropdownTriggerFor]',
    standalone: true,
    host: {
        '(click)': 'toggleDropdown()'
    }
})
export class DropdownTriggerForDirective implements OnDestroy {
    private isDropdownOpen = false;
    private overlayRef?: OverlayRef;
    private dropdownClosingActionsSub = Subscription.EMPTY;

    @Input('dropdownTriggerFor') public dropdownPanel!: DropdownPanel;

    constructor(
        private overlay: Overlay,
        private elementRef: ElementRef<HTMLElement>,
        private viewContainerRef: ViewContainerRef
    ) {}

    toggleDropdown(): void {
        this.isDropdownOpen ? this.destroyDropdown() : this.openDropdown();
    }

    openDropdown(): void {
        console.log('input width: ' + this.elementRef.nativeElement.clientWidth);
        this.isDropdownOpen = true;
        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            scrollStrategy: this.overlay.scrollStrategies.close(),
            width: this.elementRef.nativeElement.offsetWidth + 'px',
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(this.elementRef)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                        offsetY: 8,
                        offsetX: this.elementRef.nativeElement.offsetLeft
                    }
                ])
        });
        
        const templatePortal = new TemplatePortal(
            this.dropdownPanel.templateRef,
            this.viewContainerRef
        );
        this.overlayRef.attach(templatePortal);

        this.dropdownClosingActionsSub = this.dropdownClosingActions().subscribe(
            () => this.destroyDropdown()
        );
    }

    private dropdownClosingActions(): Observable<MouseEvent | void> {
        const backdropClick$ = this.overlayRef?.backdropClick();
        const detachment$ = this.overlayRef?.detachments();
        const dropdownClosed = this.dropdownPanel.closed;

        return merge(
            backdropClick$?.pipe(filter(Boolean)) ?? EMPTY,
            detachment$?.pipe(filter(Boolean)) ?? EMPTY,
            dropdownClosed
        );
    }

    private destroyDropdown(): void {
        if (!this.overlayRef || !this.isDropdownOpen) {
            return;
        }
        this.dropdownClosingActionsSub.unsubscribe();
        this.isDropdownOpen = false;
        this.overlayRef.detach();
    }

    ngOnDestroy(): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
    }
}
  