import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalCommunicationsComponent } from './animal-communications.component';

describe('ContainerComponent', () => {
  let component: AnimalCommunicationsComponent;
  let fixture: ComponentFixture<AnimalCommunicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimalCommunicationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalCommunicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
