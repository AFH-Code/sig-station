import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStationComponent } from './detail-station.component';

describe('DetailStationComponent', () => {
  let component: DetailStationComponent;
  let fixture: ComponentFixture<DetailStationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailStationComponent]
    });
    fixture = TestBed.createComponent(DetailStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
