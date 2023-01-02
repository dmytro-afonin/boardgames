import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalStatusComponent } from './animal-status.component';

describe('ContainerComponent', () => {
  let component: AnimalStatusComponent;
  let fixture: ComponentFixture<AnimalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimalStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
