import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSiteModalComponent } from './edit-site-modal.component';

describe('EditSiteModalComponent', () => {
  let component: EditSiteModalComponent;
  let fixture: ComponentFixture<EditSiteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSiteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSiteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
