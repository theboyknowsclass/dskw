import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SourceImageStore, OverlayStore } from '../../stores';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private router = inject(Router);
  private sourceImageStore = inject(SourceImageStore);
  private overlayStore = inject(OverlayStore);
  private ngZone = inject(NgZone);

  protected sourceUri = this.sourceImageStore.uri;
  protected points = this.overlayStore.points;

  protected transformedImageUrl: string | null = null;
  protected isTransforming = false;

  constructor() {
    // Redirect to home if no image is loaded
    if (!this.sourceUri()) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(): void {
    // Transform the image after view is initialized
    // This ensures the canvas is available
    setTimeout(() => this.transformImage(), 100);
  }

  protected async transformImage(): Promise<void> {
    const sourceUri = this.sourceUri();
    const points = this.points();

    if (!sourceUri || points.length !== 4) {
      return;
    }

    this.isTransforming = true;

    // Run intensive image processing outside NgZone to avoid impacting UI
    this.ngZone.runOutsideAngular(async () => {
      try {
        // Load the image
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Necessary for canvas to be able to use the image

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = sourceUri;
        });

        // Get canvas and context
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Set canvas size to the image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // In a real implementation, we would use a perspective transform based on the points
        // For now, we'll just crop to the bounding box of the points

        // Find the bounding box
        const minX = Math.min(...points.map((p) => p.x));
        const maxX = Math.max(...points.map((p) => p.x));
        const minY = Math.min(...points.map((p) => p.y));
        const maxY = Math.max(...points.map((p) => p.y));

        // Scale back to original image size
        const scaleX =
          img.width / this.sourceImageStore.scaledDimensions().width;
        const scaleY =
          img.height / this.sourceImageStore.scaledDimensions().height;

        const scaledMinX = minX * scaleX;
        const scaledMaxX = maxX * scaleX;
        const scaledMinY = minY * scaleY;
        const scaledMaxY = maxY * scaleY;

        const width = scaledMaxX - scaledMinX;
        const height = scaledMaxY - scaledMinY;

        // Create a new canvas for the cropped image
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;

        const croppedCtx = croppedCanvas.getContext('2d');

        if (!croppedCtx) {
          throw new Error('Failed to get context for cropped canvas');
        }

        // Draw the cropped portion
        croppedCtx.drawImage(
          canvas,
          scaledMinX,
          scaledMinY,
          width,
          height,
          0,
          0,
          width,
          height
        );

        // Create high-quality output
        const transformedDataUrl = croppedCanvas.toDataURL('image/png', 0.95);

        // Update the UI within NgZone
        this.ngZone.run(() => {
          this.transformedImageUrl = transformedDataUrl;
          this.isTransforming = false;
        });
      } catch (error) {
        console.error('Error transforming image:', error);

        // Update the UI within NgZone
        this.ngZone.run(() => {
          this.isTransforming = false;
        });
      }
    });
  }

  protected downloadImage(): void {
    const imageUrl = this.transformedImageUrl;
    if (!imageUrl) return;

    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'transformed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
