import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';

export type ThemeMode = 'light' | 'dark';

/**
 * Represents the state of the theme store.
 */
export interface ThemeState {
  mode: ThemeMode;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeStore {
  // Private state signals
  private state: WritableSignal<ThemeState> = signal({
    mode: 'light',
  });

  // Public selectors (computed signals)
  readonly mode: Signal<ThemeMode> = computed(() => this.state().mode);

  readonly isDarkMode: Signal<boolean> = computed(
    () => this.state().mode === 'dark'
  );

  // Actions
  toggleTheme(): void {
    this.state.update((state) => ({
      ...state,
      mode: state.mode === 'light' ? 'dark' : 'light',
    }));
  }

  setTheme(mode: ThemeMode): void {
    this.state.update((state) => ({ ...state, mode }));
  }
}
