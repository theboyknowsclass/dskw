import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeStore } from './stores/theme.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private themeStore = inject(ThemeStore);

  constructor() {
    // Apply theme changes to the body element
    effect(() => {
      const isDarkMode = this.themeStore.isDarkMode();
      document.body.classList.toggle('dark-theme', isDarkMode);
    });
  }
}
