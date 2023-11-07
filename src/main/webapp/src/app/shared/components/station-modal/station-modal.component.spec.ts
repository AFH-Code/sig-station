import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationModalComponent } from './station-modal.component';

describe('StationModalComponent', () => {
  let component: StationModalComponent;
  let fixture: ComponentFixture<StationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
