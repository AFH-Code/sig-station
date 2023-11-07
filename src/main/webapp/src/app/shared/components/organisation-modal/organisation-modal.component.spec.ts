import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationModalComponent } from './organisation-modal.component';

describe('OrganisationModalComponent', () => {
  let component: OrganisationModalComponent;
  let fixture: ComponentFixture<OrganisationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganisationModalComponent]
    });
    fixture = TestBed.createComponent(OrganisationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
