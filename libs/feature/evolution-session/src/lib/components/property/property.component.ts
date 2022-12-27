import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CardTypes } from '@boardgames/data/evolution-session';
import { UI_PROPERTY_MAP, UiProperty } from '../../ui-player';

@Component({
  selector: 'feature-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComponent {
  @Input() type!: CardTypes;
  propertyMap: Record<CardTypes, UiProperty> = UI_PROPERTY_MAP;
}
