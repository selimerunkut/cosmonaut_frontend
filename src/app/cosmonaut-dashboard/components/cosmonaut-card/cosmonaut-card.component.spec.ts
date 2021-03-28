import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmonautCardComponent } from './cosmonaut-card.component';

describe('CosmonautCardComponent', () => {
  let component: CosmonautCardComponent;
  let fixture: ComponentFixture<CosmonautCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CosmonautCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CosmonautCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
