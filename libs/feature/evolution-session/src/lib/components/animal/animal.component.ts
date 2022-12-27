import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CardTypes } from '@boardgames/data/evolution-session';
import { UI_PROPERTY_MAP } from '../../ui-player';

@Component({
  selector: 'feature-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalComponent {
  @Input() type: CardTypes = CardTypes.ANIMAL;
  @Input() actioned: boolean | undefined = false;
  propertyUIMap = UI_PROPERTY_MAP;
}
