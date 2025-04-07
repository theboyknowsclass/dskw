import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { Point } from '../models/point.model';

/**
 * Represents the state of the overlay store.
 */
export interface OverlayState {
  activePointIndex: number | null;
  points: Point[];
}

@Injectable({
  providedIn: 'root',
})
export class OverlayStore {
  // Default points for rectangle (clockwise from top-left)
  private readonly DEFAULT_POINTS_RATIO = [
    { x: 0.1, y: 0.1 }, // top-left
    { x: 0.9, y: 0.1 }, // top-right
    { x: 0.9, y: 0.9 }, // bottom-right
    { x: 0.1, y: 0.9 }, // bottom-left
  ];

  // Private state signals
  private state: WritableSignal<OverlayState> = signal({
    activePointIndex: null,
    points: [],
  });

  // Public selectors (computed signals)
  readonly activePointIndex: Signal<number | null> = computed(
    () => this.state().activePointIndex
  );

  readonly points: Signal<Point[]> = computed(() => this.state().points);

  readonly activePoint: Signal<Point | null> = computed(() => {
    const index = this.state().activePointIndex;
    if (index === null) return null;
    return this.state().points[index];
  });

  // Actions
  setActivePointIndex(index: number | null): void {
    this.state.update((state) => ({ ...state, activePointIndex: index }));
  }

  updatePoint(index: number, point: Point): void {
    this.state.update((state) => {
      const newPoints = [...state.points];
      newPoints[index] = point;
      return { ...state, points: newPoints };
    });
  }

  initializePoints(imageWidth: number, imageHeight: number): void {
    const points = this.DEFAULT_POINTS_RATIO.map((ratio) => ({
      x: ratio.x * imageWidth,
      y: ratio.y * imageHeight,
    }));

    this.state.update((state) => ({ ...state, points }));
  }

  resetPoints(): void {
    this.state.update((state) => ({
      ...state,
      points: [],
      activePointIndex: null,
    }));
  }
}
