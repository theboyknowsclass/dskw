import { Injectable, Signal, computed, signal } from '@angular/core';
import { Dimensions } from '../models/dimensions.model';

@Injectable({
  providedIn: 'root',
})
export class ScreenDimensionsService {
  private dimensions = signal<Dimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  readonly isLandscape: Signal<boolean> = computed(
    () => this.dimensions().width > this.dimensions().height
  );

  readonly width: Signal<number> = computed(() => this.dimensions().width);
  readonly height: Signal<number> = computed(() => this.dimensions().height);

  constructor() {
    // Listen for window resize events
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    this.dimensions.set({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
}
