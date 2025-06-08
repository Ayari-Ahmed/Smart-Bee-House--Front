import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFermierComponent } from './dashboard-fermier.component';

describe('DashboardFermierComponent', () => {
  let component: DashboardFermierComponent;
  let fixture: ComponentFixture<DashboardFermierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardFermierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFermierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
