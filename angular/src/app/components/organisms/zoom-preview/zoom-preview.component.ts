import {
  Component,
  Input,
  inject,
  computed,
  signal,
  effect,
  OnDestroy,
  EffectRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayStore } from '../../../stores/overlay.store';
import { SourceImageStore } from '../../../stores/source-image.store';
import { Point } from '../../../models/point.model';

/** The zoom factor applied to the preview image */
const ZOOM_FACTOR = 4;

/**
 * A component that displays a zoomed preview of an image based on the active point.
 * The preview zooms in on the area around the active point, providing a detailed view
 * of that specific region of the image.
 */
@Component({
  selector: 'app-zoom-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zoom-preview.component.html',
  styleUrls: ['./zoom-preview.component.scss'],
})
export class ZoomPreviewComponent implements OnDestroy {
  /** The size of the preview container in pixels */
  @Input() size!: number;

  private overlayStore = inject(OverlayStore);
  private sourceImageStore = inject(SourceImageStore);
  private effectRef: EffectRef | null = null;

  /** Signal that controls the background position of the zoomed image */
  private positionSignal = signal<string>('center');
  /** Signal that controls the background size of the zoomed image */
  private backgroundSizeSignal = signal<string>(`${100}%`);

  /** The currently active point in the image */
  protected activePoint = this.overlayStore.activePoint;
  /** The URL of the source image */
  protected imageUrl = this.sourceImageStore.uri;

  /** Computed value for the background position based on the active point */
  protected backgroundPosition = computed(() => this.positionSignal());
  /** Computed value for the background size based on the zoom factor */
  protected backgroundSize = computed(() => this.backgroundSizeSignal());

  /**
   * Initializes the component and sets up an effect to update the background position
   * and size when the active point changes.
   */
  constructor() {
    // Set up an effect to update background position when point changes
    this.effectRef = effect(() => {
      const point = this.activePoint();
      if (!point) {
        this.positionSignal.set('center');
        return;
      }

      const scaledWidth = this.sourceImageStore.scaledDimensions().width;
      const scaledHeight = this.sourceImageStore.scaledDimensions().height;

      if (!scaledWidth || !scaledHeight) return;

      const backgroundSize = `${scaledWidth * ZOOM_FACTOR}px ${scaledHeight * ZOOM_FACTOR}px`;
      this.backgroundSizeSignal.set(backgroundSize);

      const zoomedPosX = point.x * ZOOM_FACTOR - this.size / 2;
      const zoomedPosY = point.y * ZOOM_FACTOR - this.size / 2;
      const position = `${-zoomedPosX}px  ${-zoomedPosY}px`;
      this.positionSignal.set(position);
    });
  }

  /**
   * Cleanup method that destroys the effect when the component is destroyed
   * to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.effectRef) {
      this.effectRef.destroy();
    }
  }
}
