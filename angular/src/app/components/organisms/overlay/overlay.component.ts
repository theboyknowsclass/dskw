import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ElementRef,
  NgZone,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayStore } from '../../../stores/overlay.store';
import { Point } from '../../../models/point.model';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnChanges, OnDestroy {
  @Input() imageWidth!: number;
  @Input() imageHeight!: number;

  private overlayStore = inject(OverlayStore);
  private elementRef = inject(ElementRef);
  private ngZone = inject(NgZone);

  private isDragging = false;
  private containerRect: DOMRect | null = null;
  private animationFrameId: number | null = null;
  private pendingPoint: Point | null = null;
  private activeIndex: number | null = null;

  // Get state from store
  protected points = this.overlayStore.points;
  protected activePointIndex = this.overlayStore.activePointIndex;

  ngOnChanges(changes: SimpleChanges): void {
    // Initialize points when image dimensions change
    if (
      (changes['imageWidth'] || changes['imageHeight']) &&
      this.imageWidth &&
      this.imageHeight
    ) {
      this.overlayStore.initializePoints(this.imageWidth, this.imageHeight);
    }
  }

  ngOnDestroy(): void {
    this.cancelAnimationFrame();
  }

  protected onPointMouseDown(event: MouseEvent, index: number): void {
    event.stopPropagation();
    event.preventDefault();

    // Calculate container rect once at the start of dragging
    this.containerRect = this.elementRef.nativeElement
      .querySelector('.overlay-container')
      .getBoundingClientRect();
    this.isDragging = true;
    this.activeIndex = index;

    // Run outside NgZone to avoid triggering change detection too often
    this.ngZone.runOutsideAngular(() => {
      this.overlayStore.setActivePointIndex(index);
    });
  }

  protected onPointTouchStart(event: TouchEvent, index: number): void {
    event.stopPropagation();
    event.preventDefault();

    // Calculate container rect once at the start of dragging
    this.containerRect = this.elementRef.nativeElement
      .querySelector('.overlay-container')
      .getBoundingClientRect();
    this.isDragging = true;
    this.activeIndex = index;

    // Run outside NgZone to avoid triggering change detection too often
    this.ngZone.runOutsideAngular(() => {
      this.overlayStore.setActivePointIndex(index);
    });
  }

  protected onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || this.activeIndex === null || !this.containerRect)
      return;

    // Calculate the point position
    const x = Math.max(
      0,
      Math.min(this.imageWidth, event.clientX - this.containerRect.left)
    );
    const y = Math.max(
      0,
      Math.min(this.imageHeight, event.clientY - this.containerRect.top)
    );

    // Set the pending point - will be applied in animation frame
    this.pendingPoint = { x, y };

    // Schedule an animation frame if not already scheduled
    this.requestAnimationFrame();
  }

  protected onTouchStart(event: TouchEvent): void {
    // Handle background touches if needed
  }

  protected onTouchMove(event: TouchEvent): void {
    if (
      !this.isDragging ||
      this.activeIndex === null ||
      !this.containerRect ||
      !event.touches.length
    )
      return;

    event.preventDefault(); // Prevent scrolling

    const touch = event.touches[0];
    // Calculate the point position
    const x = Math.max(
      0,
      Math.min(this.imageWidth, touch.clientX - this.containerRect.left)
    );
    const y = Math.max(
      0,
      Math.min(this.imageHeight, touch.clientY - this.containerRect.top)
    );

    // Set the pending point - will be applied in animation frame
    this.pendingPoint = { x, y };

    // Schedule an animation frame if not already scheduled
    this.requestAnimationFrame();
  }

  protected onPointerUp(): void {
    this.cancelAnimationFrame();
    this.isDragging = false;
    this.activeIndex = null;
    this.containerRect = null;
    this.pendingPoint = null;

    // Run in the zone to ensure state is updated
    this.ngZone.run(() => {
      this.overlayStore.setActivePointIndex(null);
    });
  }

  protected onBackgroundClick(event: MouseEvent): void {
    // Nothing to do here if we want to enable clicking on the background
    // Could be used to add new points in the future
  }

  protected polygonPoints(): string {
    return this.points()
      .map((point) => `${point.x},${point.y}`)
      .join(' ');
  }

  private requestAnimationFrame(): void {
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(() =>
        this.updatePointPosition()
      );
    }
  }

  private cancelAnimationFrame(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updatePointPosition(): void {
    this.animationFrameId = null;

    if (this.pendingPoint && this.activeIndex !== null) {
      // Apply the update in the zone to ensure it's reflected in the UI
      this.ngZone.run(() => {
        this.overlayStore.updatePoint(this.activeIndex!, this.pendingPoint!);
      });

      this.pendingPoint = null;
    }

    // If still dragging, schedule the next frame
    if (this.isDragging) {
      this.requestAnimationFrame();
    }
  }
}
