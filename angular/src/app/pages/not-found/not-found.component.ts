import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button routerLink="/">Return to Home</button>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100%;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 2rem;
      }

      button {
        padding: 1rem 2rem;
        border: none;
        border-radius: 4px;
        background-color: #333;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      button:hover {
        background-color: #555;
      }
    `,
  ],
})
export class NotFoundComponent {}
