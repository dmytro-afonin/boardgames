import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'boardgames-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent {
  title = 'conflict';
}
