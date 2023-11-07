import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrganisationsComponent } from './list-organisations.component';

describe('ListOrganisationsComponent', () => {
  let component: ListOrganisationsComponent;
  let fixture: ComponentFixture<ListOrganisationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOrganisationsComponent]
    });
    fixture = TestBed.createComponent(ListOrganisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
