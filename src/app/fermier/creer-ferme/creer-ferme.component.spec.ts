import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerFermeComponent } from './creer-ferme.component';

describe('CreerFermeComponent', () => {
  let component: CreerFermeComponent;
  let fixture: ComponentFixture<CreerFermeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreerFermeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerFermeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
