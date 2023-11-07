import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAntenneComponent } from './list-antenne.component';

describe('ListAntenneComponent', () => {
  let component: ListAntenneComponent;
  let fixture: ComponentFixture<ListAntenneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAntenneComponent]
    });
    fixture = TestBed.createComponent(ListAntenneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
