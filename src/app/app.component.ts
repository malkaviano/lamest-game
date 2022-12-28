import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  goToLink(url: string): Window | null {
    return window.open(url, '_blank');
  }
}
