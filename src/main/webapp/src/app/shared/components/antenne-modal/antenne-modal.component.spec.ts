import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntenneModalComponent } from './antenne-modal.component';

describe('AntenneModalComponent', () => {
  let component: AntenneModalComponent;
  let fixture: ComponentFixture<AntenneModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AntenneModalComponent]
    });
    fixture = TestBed.createComponent(AntenneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
