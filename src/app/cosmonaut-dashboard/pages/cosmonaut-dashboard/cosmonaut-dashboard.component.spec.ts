import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmonautDashboardComponent } from './cosmonaut-dashboard.component';

describe('CosmonautDashboardComponent', () => {
  let component: CosmonautDashboardComponent;
  let fixture: ComponentFixture<CosmonautDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CosmonautDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CosmonautDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
