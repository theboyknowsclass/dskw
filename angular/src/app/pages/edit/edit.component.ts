import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SourceImageStore, OverlayStore } from '../../stores';
import { ScreenDimensionsService } from '../../utils/screen-dimensions.service';
import {
  OverlayComponent,
  ZoomPreviewComponent,
} from '../../components/organisms';

const MAX_ZOOM_WINDOW_SIZE = 400;
const MAX_ZOOM_WINDOW_RATIO = 0.5;
const ZOOM_WINDOW_PADDING = 40;

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, OverlayComponent, ZoomPreviewComponent],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  private router = inject(Router);
  private sourceImageStore = inject(SourceImageStore);
  private overlayStore = inject(OverlayStore);
  private screenDimensions = inject(ScreenDimensionsService);

  // Source image signals
  protected sourceUri = this.sourceImageStore.uri;
  protected originalDimensions = this.sourceImageStore.originalDimensions;
  protected scaledDimensions = this.sourceImageStore.scaledDimensions;

  // Overlay signals
  protected activePointIndex = this.overlayStore.activePointIndex;

  // Screen dimension signals
  protected isLandscape = this.screenDimensions.isLandscape;

  // UI signals
  protected zoomWindowSize = computed(() => {
    if (this.isLandscape()) {
      return Math.min(
        window.innerWidth * MAX_ZOOM_WINDOW_RATIO,
        MAX_ZOOM_WINDOW_SIZE
      );
    } else {
      return Math.min(
        window.innerHeight * MAX_ZOOM_WINDOW_RATIO,
        MAX_ZOOM_WINDOW_SIZE
      );
    }
  });

  protected isDragging = computed(() => this.activePointIndex() !== null);

  protected scaledWidth = computed(() => this.scaledDimensions()?.width || 0);
  protected scaledHeight = computed(() => this.scaledDimensions()?.height || 0);

  constructor() {
    // Redirect to home if no image is loaded
    effect(() => {
      if (!this.sourceUri()) {
        this.router.navigate(['/']);
      }
    });

    // Calculate scaled dimensions when container size changes
    effect(() => {
      if (!this.originalDimensions()) return;

      const isLandscape = this.isLandscape();
      const zoomSize = this.zoomWindowSize();

      let maxImageWidth = 0;
      let maxImageHeight = 0;

      if (isLandscape) {
        maxImageWidth = window.innerWidth - zoomSize - ZOOM_WINDOW_PADDING;
        maxImageHeight = window.innerHeight;
      } else {
        maxImageWidth = window.innerWidth;
        maxImageHeight = window.innerHeight - zoomSize - ZOOM_WINDOW_PADDING;
      }

      const { width: imageWidth, height: imageHeight } =
        this.originalDimensions();

      // Calculate scale factors
      const widthScale = maxImageWidth / imageWidth;
      const heightScale = maxImageHeight / imageHeight;

      // Use the smaller scale factor to ensure the image fits
      const scaleFactor = Math.min(widthScale, heightScale);

      this.sourceImageStore.setScaledDimensions({
        width: imageWidth * scaleFactor,
        height: imageHeight * scaleFactor,
      });
    });

    // Clear overlay points when component is destroyed
    effect(() => {
      const uri = this.sourceUri();
      if (!uri) {
        this.overlayStore.resetPoints();
      }
    });
  }
}
