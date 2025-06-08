import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FermierHeaderComponent } from './fermier-header.component';

describe('FermierHeaderComponent', () => {
  let component: FermierHeaderComponent;
  let fixture: ComponentFixture<FermierHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FermierHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FermierHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
