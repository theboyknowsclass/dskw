import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { Dimensions } from '../models/dimensions.model';

/**
 * Represents the state of the source image store.
 */
export interface SourceImageState {
  uri: string | null;
  originalDimensions: Dimensions;
  scaledDimensions: Dimensions;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SourceImageStore {
  // Private state signals
  private state: WritableSignal<SourceImageState> = signal({
    uri: null,
    originalDimensions: { width: 0, height: 0 },
    scaledDimensions: { width: 0, height: 0 },
    isLoading: false,
    error: null,
  });

  // Public selectors (computed signals)
  readonly uri: Signal<string | null> = computed(() => this.state().uri);
  readonly originalDimensions: Signal<Dimensions> = computed(
    () => this.state().originalDimensions
  );
  readonly scaledDimensions: Signal<Dimensions> = computed(
    () => this.state().scaledDimensions
  );
  readonly isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  readonly error: Signal<string | null> = computed(() => this.state().error);

  // Actions
  setUri(uri: string | null): void {
    this.state.update((state) => ({ ...state, uri }));
  }

  setOriginalDimensions(dimensions: Dimensions): void {
    this.state.update((state) => ({
      ...state,
      originalDimensions: dimensions,
    }));
  }

  setScaledDimensions(dimensions: Dimensions): void {
    this.state.update((state) => ({ ...state, scaledDimensions: dimensions }));
  }

  setLoading(isLoading: boolean): void {
    this.state.update((state) => ({ ...state, isLoading }));
  }

  setError(error: string | null): void {
    this.state.update((state) => ({ ...state, error }));
  }

  clearImage(): void {
    this.state.update((state) => ({
      ...state,
      uri: null,
      originalDimensions: { width: 0, height: 0 },
      scaledDimensions: { width: 0, height: 0 },
      error: null,
    }));
  }
}
