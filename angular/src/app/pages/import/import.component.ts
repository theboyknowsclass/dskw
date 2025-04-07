import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SourceImageStore } from '../../stores/source-image.store';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent {
  private router = inject(Router);
  private sourceImageStore = inject(SourceImageStore);

  protected isDragging = false;
  protected errorMessage = '';

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    if (!file.type.match('image.*')) {
      this.errorMessage = 'Please select an image file.';
      return;
    }

    this.sourceImageStore.setLoading(true);
    this.errorMessage = '';

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          this.sourceImageStore.setUri(img.src);
          this.sourceImageStore.setOriginalDimensions({
            width: img.width,
            height: img.height,
          });
          this.sourceImageStore.setLoading(false);
          this.router.navigate(['/edit']);
        };

        img.onerror = () => {
          this.sourceImageStore.setLoading(false);
          this.errorMessage = 'Error loading image.';
        };

        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => {
      this.sourceImageStore.setLoading(false);
      this.errorMessage = 'Error reading file.';
    };

    reader.readAsDataURL(file);
  }
}
