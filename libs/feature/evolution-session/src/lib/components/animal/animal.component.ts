import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'feature-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalComponent {
  @Input() title = 'animal';
  @Input() actioned: boolean | undefined = false;
}
