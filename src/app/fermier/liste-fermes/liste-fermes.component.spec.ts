import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFermesComponent } from './liste-fermes.component';

describe('ListeFermesComponent', () => {
  let component: ListeFermesComponent;
  let fixture: ComponentFixture<ListeFermesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeFermesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeFermesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
