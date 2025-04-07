import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeStore } from '../../stores/theme.store';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private themeStore = inject(ThemeStore);

  protected isDarkMode = this.themeStore.isDarkMode;

  protected toggleTheme(): void {
    this.themeStore.toggleTheme();
  }
}
